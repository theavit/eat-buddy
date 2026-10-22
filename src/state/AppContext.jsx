import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ACTIVITY } from "../data/activity";
import { WOULD_YOU_RATHER } from "../data/games";
import { LUNCHES } from "../data/lunches";
import { COLLEAGUES } from "../data/people";
import { DEFAULT_BIO } from "../data/profile";
import { RESTAURANTS } from "../data/restaurants";
import { SAMPLE_USER } from "../data/user";
import { useSounds } from "../hooks/useSounds";
import {
  AUTH_REDIRECT,
  clearAuthRedirect,
  fetchAuthSettings,
  getCurrentUser,
  logOut,
  loginWithEmail,
  loginWithProvider,
  onAuthChange,
  registerWithEmail,
  resendSignupEmail,
  sendPasswordReset,
  sendPhoneCode,
  updatePassword,
  updateProfileData,
  verifyPhoneCode,
} from "../lib/auth";
import {
  createGroup,
  fetchGroups,
  joinGroupWithCode,
  leaveGroupMembership,
  removeGroupMember,
} from "../lib/groups";

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside <AppProvider>");
  }
  return context;
};

const MOMENT_PHOTOS_KEY = "eb-moment-photos";

function loadMomentPhotos() {
  try {
    return JSON.parse(localStorage.getItem(MOMENT_PHOTOS_KEY) || "{}");
  } catch {
    return {};
  }
}

const emptyCreateForm = () => ({
  name: "",
  restaurant: RESTAURANTS[0].name,
  meta: "Main Lobby",
  date: "",
  time: "",
  groupName: "No group",
  inviteMode: "",
});

// Demo mode runs entirely on sample data, so it works without the Supabase backend.
const DEMO_USER = {
  ...SAMPLE_USER,
  id: "demo-user",
  lastName: "Tan",
};

function demoGroup(id, name, code, members, adminName) {
  const memberRows = members.map((member) => ({
    id: member === DEMO_USER.name ? DEMO_USER.id : `demo-${member}`,
    name: member,
    avatar: "",
    role: member === adminName ? "admin" : "member",
  }));
  const admin = memberRows.find((memberRow) => memberRow.role === "admin");
  return {
    id,
    name,
    code,
    createdAt: "2026-10-01T09:00:00Z",
    adminId: admin.id,
    admin: admin.name,
    members,
    memberRows,
    isAdmin: admin.id === DEMO_USER.id,
  };
}

const DEMO_GROUPS = [
  demoGroup(
    "g1",
    "Marketing Lunch Crew",
    "MKT482",
    [DEMO_USER.name, "Sarah Chen", "David Kim", "Emma Watson", "Lily Nguyen", "Marcus Reed"],
    DEMO_USER.name,
  ),
  demoGroup(
    "g2",
    "Design Team",
    "DSN731",
    [DEMO_USER.name, "Sarah Chen", "Priya Patel", "Alex Torres", "Jordan Lee"],
    "Priya Patel",
  ),
  demoGroup(
    "g3",
    "Cross-Team Foodies",
    "XTF905",
    [DEMO_USER.name, "Emma Watson", "Marcus Reed", "Jordan Lee"],
    "Emma Watson",
  ),
];

const DEMO_ONLY_MESSAGE = "This is the demo, so this needs a real account.";

const INITIAL_STATE = {
  authed: false,
  demo: false,
  user: SAMPLE_USER,
  authMode: AUTH_REDIRECT.recovery ? "reset" : AUTH_REDIRECT.present ? "signin" : "landing",
  authReady: false,
  enabledProviders: null,
  phoneEnabled: false,
  authNotice: AUTH_REDIRECT.error,
  pendingEmail: "",
  tab: "home",
  category: "All",
  searchQuery: "",
  modal: null,
  photoOverrides: loadMomentPhotos(),
  lunches: LUNCHES,
  restaurants: RESTAURANTS,
  invitees: ["e1"],
  createForm: emptyCreateForm(),
  addPlaceForm: {
    name: "",
    description: "",
  },
  gameFoods: ["Ramen", "Sushi", "Pizza"],
  newFoodInput: "",
  spinning: false,
  wheelRotation: 0,
  spinResult: null,
  activeGame: "wheel",
  yesNoQuestion: "",
  yesNoResult: null,
  yesNoSpinning: false,
  voteOptions: [
    {
      name: "Mori Kitchen",
      votes: 0,
    },
    {
      name: "Sushi Kichi",
      votes: 0,
    },
  ],
  newVoteInput: "",
  wyrIndex: 0,
  wyrChoice: null,
  soundOn: true,
  activity: ACTIVITY,
  sidebarCollapsed: false,
  profileMenuOpen: false,
  toast: null,
  groups: [],
  groupsLoading: false,
  groupsError: "",
  selectedGroupId: null,
  createGroupName: "",
  joinCode: "",
  joinError: "",
  copiedCode: null,
  groupPlanFilter: "upcoming",
  manualAddressOpen: false,
  vibeColor: "#F26A21",
  hatColor: "#F26A21",
  scarfColor: "#8FA36A",
  banner: 0,
  mood: "Hungry",
  gender: "Woman",
  bioText: DEFAULT_BIO,
  statusText: "Craving sushi today!",
};

export function AppProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);
  const toastTimer = useRef(null);
  const fileInputs = useRef({});
  const stateRef = useRef(state);
  stateRef.current = state;
  const busyRef = useRef(false);
  const patch = useCallback((update) => {
    setState((current) => ({
      ...current,
      ...(typeof update == "function" ? update(current) : update),
    }));
  }, []);
  const sounds = useSounds(state.soundOn);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const showToast = useCallback(
    (toast) => {
      patch({
        toast,
      });
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(
        () =>
          patch({
            toast: null,
          }),
        2600,
      );
    },
    [patch],
  );
  const addActivity = useCallback(
    (icon, text) => {
      patch((prev) => ({
        activity: [
          {
            icon,
            text,
            time: "Just now",
          },
          ...prev.activity,
        ],
      }));
    },
    [patch],
  );
  const reloadGroups = useCallback(
    async (userId) => {
      const id = userId || stateRef.current.user?.id;
      if (!id || stateRef.current.demo) {
        return;
      }
      patch({
        groupsLoading: true,
        groupsError: "",
      });
      const result = await fetchGroups(id);
      patch(
        result.ok
          ? {
              groups: result.groups,
              groupsLoading: false,
              groupsError: "",
            }
          : {
              groupsLoading: false,
              groupsError: result.error,
            },
      );
    },
    [patch],
  );
  const completeSignIn = useCallback(
    (user) => {
      reloadGroups(user.id);
      patch({
        authed: true,
        user,
        tab: "home",
        modal: null,
        profileMenuOpen: false,
        authNotice: "",
        pendingEmail: "",
        authReady: true,
      });
    },
    [patch, reloadGroups],
  );
  useEffect(() => {
    let active = true;
    fetchAuthSettings().then((settings) => {
      if (active && settings) {
        patch({
          enabledProviders: settings.providers,
          phoneEnabled: settings.phone,
        });
      }
    });
    getCurrentUser()
      .then((user) => {
        if (active) {
          if (AUTH_REDIRECT.recovery) {
            patch({
              authed: false,
              authMode: "reset",
              authReady: true,
            });
          } else if (user) {
            patch({
              authed: true,
              user,
              authReady: true,
            });
            reloadGroups(user.id);
          } else {
            patch({
              authReady: true,
            });
          }
        }
      })
      .catch(
        () =>
          active &&
          patch({
            authReady: true,
          }),
      )
      .finally(() => clearAuthRedirect());
    const unsubscribe = onAuthChange(({ event, user }) => {
      if (active) {
        if (event === "PASSWORD_RECOVERY") {
          patch({
            authed: false,
            authMode: "reset",
            authReady: true,
          });
          return;
        }
        if (event === "SIGNED_OUT") {
          patch({
            authed: false,
            user: SAMPLE_USER,
            authMode: "signin",
            authReady: true,
            groups: [],
            selectedGroupId: null,
          });
          return;
        }
        if (user) {
          patch((prev) =>
            prev.authMode === "reset" && !prev.authed
              ? {
                  authReady: true,
                }
              : {
                  authed: true,
                  user,
                  authReady: true,
                },
          );
        }
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [patch, reloadGroups]);
  const signIn = useCallback(
    async ({ email, password, remember = true }) => {
      const result = await loginWithEmail({
        email,
        password,
        remember,
      });
      if (result.ok) {
        completeSignIn(result.user);
      }
      return result;
    },
    [completeSignIn],
  );
  const signUp = useCallback(
    async ({ firstName, lastName, email, password }) => {
      const result = await registerWithEmail({
        firstName,
        lastName,
        email,
        password,
      });
      if (result.ok) {
        completeSignIn(result.user);
      } else if (result.needsConfirmation) {
        patch({
          pendingEmail: result.email,
        });
      }
      return result;
    },
    [completeSignIn, patch],
  );
  const signInWithProvider = useCallback(
    async (provider, remember = true) => {
      patch({
        authNotice: "",
      });
      const result = await loginWithProvider(provider, remember);
      if (!result.ok) {
        patch({
          authNotice: result.error,
        });
      }
      return result;
    },
    [patch],
  );
  const saveProfile = useCallback(
    async (profile) => {
      if (stateRef.current.demo) {
        const user = { ...stateRef.current.user, ...profile };
        user.name = `${user.firstName} ${user.lastName}`.trim();
        user.initials = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();
        patch({
          user,
        });
        return {
          ok: true,
          user,
        };
      }
      const result = await updateProfileData(profile);
      if (result.ok) {
        patch({
          user: result.user,
        });
      }
      return result;
    },
    [patch],
  );
  const requestPasswordReset = useCallback((email) => sendPasswordReset(email), []);
  const resendConfirmationEmail = useCallback((email) => resendSignupEmail(email), []);
  const requestPhoneCode = useCallback((request) => sendPhoneCode(request), []);
  const confirmPhoneCode = useCallback(
    async ({ phone, token }) => {
      const result = await verifyPhoneCode({
        phone,
        token,
      });
      if (result.ok) {
        completeSignIn(result.user);
      }
      return result;
    },
    [completeSignIn],
  );
  const completePasswordReset = useCallback(
    async (password) => {
      const result = await updatePassword(password);
      if (result.ok) {
        completeSignIn(result.user);
      }
      return result;
    },
    [completeSignIn],
  );
  const startDemo = useCallback(
    () =>
      patch({
        authed: true,
        demo: true,
        user: DEMO_USER,
        tab: "home",
        modal: null,
        authReady: true,
        groups: DEMO_GROUPS,
        groupsLoading: false,
        groupsError: "",
        selectedGroupId: null,
      }),
    [patch],
  );
  const signOut = useCallback(async () => {
    const wasDemo = stateRef.current.demo;
    if (!wasDemo) {
      await logOut();
    }
    patch({
      authed: false,
      demo: false,
      user: SAMPLE_USER,
      authMode: wasDemo ? "landing" : "signin",
      modal: null,
      profileMenuOpen: false,
      authNotice: "",
      pendingEmail: "",
      groups: [],
      selectedGroupId: null,
    });
  }, [patch]);
  const setAuthMode = useCallback(
    (authMode) =>
      patch({
        authMode,
        authNotice: "",
        pendingEmail: "",
      }),
    [patch],
  );
  const go = useCallback(
    (tab) =>
      patch({
        tab,
        modal: null,
      }),
    [patch],
  );
  const goHome = useCallback(
    () =>
      patch({
        tab: "home",
        modal: null,
        profileMenuOpen: false,
      }),
    [patch],
  );
  const toggleSidebar = useCallback(
    () =>
      patch((prev) => ({
        sidebarCollapsed: !prev.sidebarCollapsed,
      })),
    [patch],
  );
  const toggleProfileMenu = useCallback(
    () =>
      patch((prev) => ({
        profileMenuOpen: !prev.profileMenuOpen,
      })),
    [patch],
  );
  const openProfile = useCallback(
    () =>
      patch({
        tab: "profile",
        modal: null,
        profileMenuOpen: false,
      }),
    [patch],
  );
  const closeModal = useCallback(
    () =>
      patch({
        modal: null,
      }),
    [patch],
  );
  const openLunch = useCallback(
    (id) =>
      patch({
        modal: {
          type: "lunch",
          id,
        },
      }),
    [patch],
  );
  const openRestaurantModal = useCallback(
    (id) =>
      patch({
        modal: {
          type: "restaurant",
          id,
        },
      }),
    [patch],
  );
  const openMomentModal = useCallback(
    (idx) =>
      patch({
        modal: {
          type: "moment",
          idx,
        },
      }),
    [patch],
  );
  const openAddPlace = useCallback(
    () =>
      patch({
        modal: {
          type: "addPlace",
        },
      }),
    [patch],
  );
  const openNotifications = useCallback(
    () =>
      patch({
        modal: {
          type: "notifications",
        },
      }),
    [patch],
  );
  const openInvite = useCallback(
    () =>
      patch({
        modal: {
          type: "create",
        },
      }),
    [patch],
  );
  const openSettings = useCallback(
    () =>
      patch({
        modal: {
          type: "settings",
        },
        profileMenuOpen: false,
      }),
    [patch],
  );
  const openCreateLunch = useCallback(
    (groupId) => {
      const id = typeof groupId == "string" ? groupId : null;
      patch((prev) => {
        const selectedGroup = id ? prev.groups.find((group) => group.id === id) : null;
        return {
          modal: {
            type: "create",
          },
          createForm: {
            ...prev.createForm,
            groupName: selectedGroup ? selectedGroup.name : "No group",
          },
        };
      });
    },
    [patch],
  );
  const toggleJoin = useCallback(
    (lunchId) =>
      patch((prev) => {
        const name = prev.user.name;
        return {
          lunches: prev.lunches.map((lunch) => {
            if (lunch.id !== lunchId) {
              return lunch;
            }
            const isParticipant = lunch.participants.includes(name);
            const wasJoined = lunch.joined || isParticipant;
            if (!wasJoined && !isParticipant && lunch.participants.length >= lunch.capacity) {
              return lunch;
            } else {
              return {
                ...lunch,
                joined: !wasJoined,
                participants: wasJoined
                  ? lunch.participants.filter((participant) => participant !== name)
                  : [...lunch.participants, name],
              };
            }
          }),
        };
      }),
    [patch],
  );
  const toggleInvitee = useCallback(
    (inviteeId) =>
      patch((prev) => ({
        invitees: prev.invitees.includes(inviteeId)
          ? prev.invitees.filter((invitee) => invitee !== inviteeId)
          : [...prev.invitees, inviteeId],
      })),
    [patch],
  );
  const setCreateField = useCallback(
    (field, value) =>
      patch((prev) => ({
        createForm: {
          ...prev.createForm,
          [field]: value,
        },
      })),
    [patch],
  );
  const submitCreate = useCallback(() => {
    patch((prev) => {
      const createForm = prev.createForm;
      const invited = prev.invitees
        .map((invitee) => (COLLEAGUES.find((colleague) => colleague.id === invitee) || {}).name)
        .filter(Boolean);
      const targetGroup = prev.groups.find((group) => group.name === createForm.groupName);
      return {
        lunches: [
          {
            id: `l${Date.now()}`,
            groupId: targetGroup ? targetGroup.id : null,
            name: createForm.name || "New lunch",
            time: createForm.time || "12:30 PM",
            dayTime: `Today, ${createForm.time || "12:30 PM"}`,
            status: "Open",
            restaurant: createForm.restaurant,
            meta: createForm.meta || "Main Lobby",
            metaIcon: "location_on",
            participants: [prev.user.name, ...invited],
            capacity: 6,
            joined: true,
            today: true,
            description: "A fresh table you just started. Invite a few more people.",
          },
          ...prev.lunches,
        ],
        modal: null,
        invitees: ["e1"],
        createForm: emptyCreateForm(),
      };
    });
    showToast("Meal plan created!");
  }, [patch, showToast]);
  const setAddPlaceField = useCallback(
    (field, value) =>
      patch((prev) => ({
        addPlaceForm: {
          ...prev.addPlaceForm,
          [field]: value,
        },
      })),
    [patch],
  );
  const selectPlace = useCallback(
    (name) =>
      patch((prev) => ({
        addPlaceForm: {
          ...prev.addPlaceForm,
          name,
        },
        manualAddressOpen: false,
      })),
    [patch],
  );
  const submitAddPlace = useCallback(() => {
    patch((prev) => {
      const addPlaceForm = prev.addPlaceForm;
      if (addPlaceForm.name) {
        return {
          restaurants: [
            {
              id: `r${Date.now()}`,
              name: addPlaceForm.name,
              cuisine: "New",
              price: "$$",
              rating: "—",
              reviews: 0,
              walk: "nearby",
              description: addPlaceForm.description || "A new spot the team is trying out.",
            },
            ...prev.restaurants,
          ],
          modal: null,
          addPlaceForm: {
            name: "",
            description: "",
          },
        };
      } else {
        return {};
      }
    });
  }, [patch]);
  const onMomentPhotoChange = useCallback(
    (photoKey, event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        patch((prev) => {
          const photoOverrides = {
            ...(prev.photoOverrides || {}),
            [photoKey]: reader.result,
          };
          try {
            localStorage.setItem(MOMENT_PHOTOS_KEY, JSON.stringify(photoOverrides));
          } catch {}
          return {
            photoOverrides,
          };
        });
      reader.readAsDataURL(file);
    },
    [patch],
  );
  const registerFileInput = useCallback((key, input) => {
    fileInputs.current[key] = input;
  }, []);
  const triggerPhotoPicker = useCallback((key) => {
    if (fileInputs.current[key]) {
      fileInputs.current[key].click();
    }
  }, []);
  const openCreateGroup = useCallback(
    () =>
      patch({
        modal: {
          type: "createGroup",
        },
        createGroupName: "",
      }),
    [patch],
  );
  const openJoinGroup = useCallback(
    () =>
      patch({
        modal: {
          type: "joinGroup",
        },
        joinCode: "",
        joinError: "",
      }),
    [patch],
  );
  const openGroupDetail = useCallback(
    (selectedGroupId) =>
      patch({
        selectedGroupId,
      }),
    [patch],
  );
  const backToGroups = useCallback(
    () =>
      patch({
        selectedGroupId: null,
      }),
    [patch],
  );
  const confirmLeaveGroup = useCallback(
    (id) =>
      patch({
        modal: {
          type: "confirmLeave",
          id,
        },
      }),
    [patch],
  );
  const submitCreateGroup = useCallback(async () => {
    const name = (stateRef.current.createGroupName || "").trim();
    if (!!name && !busyRef.current) {
      busyRef.current = true;
      try {
        const result = stateRef.current.demo
          ? {
              ok: true,
              group: demoGroup(
                `demo-${Date.now()}`,
                name,
                Math.random().toString(36).slice(2, 8).toUpperCase(),
                [stateRef.current.user.name],
                stateRef.current.user.name,
              ),
            }
          : await createGroup(name, stateRef.current.user.id);
        if (!result.ok) {
          return patch({
            joinError: result.error,
          });
        }
        patch((prev) => ({
          groups: [result.group, ...prev.groups.filter((group) => group.id !== result.group.id)],
          modal: null,
          selectedGroupId: result.group.id,
          tab: "groups",
          createGroupName: "",
          joinError: "",
        }));
        showToast(`${result.group.name} created — share code ${result.group.code}`);
      } finally {
        busyRef.current = false;
      }
    }
  }, [patch, showToast]);
  const submitJoinCode = useCallback(async () => {
    const code = (stateRef.current.joinCode || "").trim();
    if (!!code && !busyRef.current) {
      busyRef.current = true;
      patch({
        joinError: "",
      });
      try {
        const result = stateRef.current.demo
          ? {
              ok: false,
              error: `${DEMO_ONLY_MESSAGE} Try creating a group instead.`,
            }
          : await joinGroupWithCode(code, stateRef.current.user.id);
        if (!result.ok) {
          return patch({
            joinError: result.error,
          });
        }
        patch((prev) => ({
          groups: [result.group, ...prev.groups.filter((group) => group.id !== result.group.id)],
          modal: null,
          selectedGroupId: result.group.id,
          tab: "groups",
          joinCode: "",
          joinError: "",
        }));
        showToast(`Joined ${result.group.name}!`);
      } finally {
        busyRef.current = false;
      }
    }
  }, [patch, showToast]);
  const leaveGroup = useCallback(
    async (groupId) => {
      const result = stateRef.current.demo
        ? {
            ok: true,
          }
        : await leaveGroupMembership(groupId);
      if (!result.ok) {
        patch({
          modal: null,
        });
        return showToast(result.error);
      }
      patch((prev) => ({
        groups: prev.groups.filter((group) => group.id !== groupId),
        selectedGroupId: null,
        modal: null,
      }));
    },
    [patch, showToast],
  );
  const removeMember = useCallback(
    async (groupId, userId) => {
      if (stateRef.current.demo) {
        return patch((prev) => ({
          groups: prev.groups.map((group) => {
            if (group.id !== groupId) {
              return group;
            }
            const memberRows = group.memberRows.filter((memberRow) => memberRow.id !== userId);
            return {
              ...group,
              memberRows,
              members: memberRows.map((memberRow) => memberRow.name),
            };
          }),
        }));
      }
      const result = await removeGroupMember(groupId, userId);
      if (!result.ok) {
        return showToast(result.error);
      }
      await reloadGroups();
    },
    [patch, reloadGroups, showToast],
  );
  const copyGroupCode = useCallback(
    (copiedCode) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(copiedCode).catch(() => {});
      }
      patch({
        copiedCode,
      });
      setTimeout(
        () =>
          patch((prev) =>
            prev.copiedCode === copiedCode
              ? {
                  copiedCode: null,
                }
              : {},
          ),
        1500,
      );
    },
    [patch],
  );
  const setActiveGame = useCallback(
    (activeGame) =>
      patch({
        activeGame,
      }),
    [patch],
  );
  const toggleSound = useCallback(
    () =>
      patch((prev) => ({
        soundOn: !prev.soundOn,
      })),
    [patch],
  );
  const addFood = useCallback(() => {
    patch((prev) => {
      const food = (prev.newFoodInput || "").trim();
      if (food) {
        return {
          gameFoods: [...prev.gameFoods, food],
          newFoodInput: "",
        };
      } else {
        return {};
      }
    });
    sounds.click();
  }, [patch, sounds]);
  const removeFood = useCallback(
    (foodIndex) =>
      patch((prev) => ({
        gameFoods: prev.gameFoods.filter((gameFood, index) => index !== foodIndex),
      })),
    [patch],
  );
  const spinWheel = useCallback(() => {
    const snapshot = state;
    if (snapshot.gameFoods.length < 2 || snapshot.spinning) {
      return;
    }
    const count = snapshot.gameFoods.length;
    const pick = Math.floor(Math.random() * count);
    const slice = 360 / count;
    const pickCenter = pick * slice + slice / 2;
    const wheelRotation = snapshot.wheelRotation + 1800 + (360 - pickCenter);
    sounds.whoosh();
    patch({
      spinning: true,
      wheelRotation,
      spinResult: null,
    });
    setTimeout(() => {
      patch({
        spinning: false,
        spinResult: snapshot.gameFoods[pick],
      });
      addActivity("casino", `The wheel picked "${snapshot.gameFoods[pick]}" for lunch`);
      sounds.win();
    }, 3200);
  }, [state, patch, sounds, addActivity]);
  const flipYesNo = useCallback(() => {
    if (state.yesNoSpinning) {
      return;
    }
    const question = (state.yesNoQuestion || "").trim();
    sounds.coin();
    patch({
      yesNoSpinning: true,
      yesNoResult: null,
    });
    setTimeout(() => {
      const yesNoResult = Math.random() < 0.5 ? "Yes" : "No";
      patch({
        yesNoSpinning: false,
        yesNoResult,
      });
      addActivity(
        "help",
        question
          ? `"${question}" — the answer was ${yesNoResult}`
          : `Yes or No landed on ${yesNoResult}`,
      );
      sounds.win();
    }, 900);
  }, [state.yesNoSpinning, state.yesNoQuestion, patch, sounds, addActivity]);
  const addVoteOption = useCallback(() => {
    patch((prev) => {
      const name = (prev.newVoteInput || "").trim();
      if (name) {
        return {
          voteOptions: [
            ...prev.voteOptions,
            {
              name,
              votes: 0,
            },
          ],
          newVoteInput: "",
        };
      } else {
        return {};
      }
    });
    sounds.click();
  }, [patch, sounds]);
  const removeVoteOption = useCallback(
    (optionIndex) =>
      patch((prev) => ({
        voteOptions: prev.voteOptions.filter((voteOption, index) => index !== optionIndex),
      })),
    [patch],
  );
  const castVote = useCallback(
    (optionIndex) => {
      sounds.click();
      patch((prev) => ({
        voteOptions: prev.voteOptions.map((voteOption, index) =>
          index === optionIndex
            ? {
                ...voteOption,
                votes: voteOption.votes + 1,
              }
            : voteOption,
        ),
        activity: [
          {
            icon: "how_to_vote",
            text: `You voted for ${prev.voteOptions[optionIndex].name} in Group Vote`,
            time: "Just now",
          },
          ...prev.activity,
        ],
      }));
    },
    [patch, sounds],
  );
  const resetVotes = useCallback(
    () =>
      patch((prev) => ({
        voteOptions: prev.voteOptions.map((voteOption) => ({
          ...voteOption,
          votes: 0,
        })),
      })),
    [patch],
  );
  const pickWyr = useCallback(
    (wyrChoice) => {
      if (state.wyrChoice) {
        return;
      }
      sounds.click();
      const question = WOULD_YOU_RATHER[state.wyrIndex % WOULD_YOU_RATHER.length];
      patch({
        wyrChoice,
      });
      addActivity(
        "compare_arrows",
        `You'd rather have "${wyrChoice === "a" ? question.a : question.b}"`,
      );
    },
    [state.wyrChoice, state.wyrIndex, patch, sounds, addActivity],
  );
  const nextWyr = useCallback(
    () =>
      patch((prev) => ({
        wyrIndex: (prev.wyrIndex + 1) % WOULD_YOU_RATHER.length,
        wyrChoice: null,
      })),
    [patch],
  );
  const value = useMemo(
    () => ({
      state,
      patch,
      signIn,
      signUp,
      signOut,
      startDemo,
      setAuthMode,
      signInWithProvider,
      requestPasswordReset,
      completePasswordReset,
      resendConfirmationEmail,
      requestPhoneCode,
      confirmPhoneCode,
      saveProfile,
      go,
      goHome,
      toggleSidebar,
      toggleProfileMenu,
      openProfile,
      closeModal,
      openLunch,
      openRestaurantModal,
      openMomentModal,
      openAddPlace,
      openNotifications,
      openInvite,
      openSettings,
      openCreateLunch,
      toggleJoin,
      toggleInvitee,
      setCreateField,
      submitCreate,
      setAddPlaceField,
      selectPlace,
      submitAddPlace,
      onMomentPhotoChange,
      registerFileInput,
      triggerPhotoPicker,
      openCreateGroup,
      openJoinGroup,
      openGroupDetail,
      backToGroups,
      confirmLeaveGroup,
      submitCreateGroup,
      submitJoinCode,
      leaveGroup,
      removeMember,
      copyGroupCode,
      reloadGroups,
      setActiveGame,
      toggleSound,
      addFood,
      removeFood,
      spinWheel,
      flipYesNo,
      addVoteOption,
      removeVoteOption,
      castVote,
      resetVotes,
      pickWyr,
      nextWyr,
      showToast,
      addActivity,
    }),
    [
      state,
      patch,
      signIn,
      signUp,
      signOut,
      startDemo,
      setAuthMode,
      signInWithProvider,
      requestPasswordReset,
      completePasswordReset,
      resendConfirmationEmail,
      requestPhoneCode,
      confirmPhoneCode,
      saveProfile,
      go,
      goHome,
      toggleSidebar,
      toggleProfileMenu,
      openProfile,
      closeModal,
      openLunch,
      openRestaurantModal,
      openMomentModal,
      openAddPlace,
      openNotifications,
      openInvite,
      openSettings,
      openCreateLunch,
      toggleJoin,
      toggleInvitee,
      setCreateField,
      submitCreate,
      setAddPlaceField,
      selectPlace,
      submitAddPlace,
      onMomentPhotoChange,
      registerFileInput,
      triggerPhotoPicker,
      openCreateGroup,
      openJoinGroup,
      openGroupDetail,
      backToGroups,
      confirmLeaveGroup,
      submitCreateGroup,
      submitJoinCode,
      leaveGroup,
      removeMember,
      copyGroupCode,
      reloadGroups,
      setActiveGame,
      toggleSound,
      addFood,
      removeFood,
      spinWheel,
      flipYesNo,
      addVoteOption,
      removeVoteOption,
      castVote,
      resetVotes,
      pickWyr,
      nextWyr,
      showToast,
      addActivity,
    ],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
