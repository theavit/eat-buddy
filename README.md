# Eat Buddy

Plan meals with colleagues, vote on where to eat, share food moments and collect achievements.

Live at https://eat-buddy.vercel.app

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production files go to dist/
```

Supabase settings are in `.env`. They are public values, so the file is safe to keep in the project.

## Where things are

| Folder | What is in it |
|---|---|
| `src/screens/` | One file per page: Home, Moments, Meal Plans, Games, Groups, Profile, Achievements, sign-in |
| `src/modals/` | Pop-ups: plan a meal, lunch details, moments, settings, groups, notifications |
| `src/components/` | Shared pieces: buttons, inputs, date and time pickers, sidebar, footer, cards |
| `src/state/AppContext.jsx` | All app state and actions (sign-in, joining lunches, games, groups) |
| `src/lib/` | Supabase connection, sign-in, groups, phone numbers, helpers |
| `src/data/` | Sample restaurants, lunches, moments, achievements and other starter content |
| `src/styles/` | Colours and sizes (`tokens.css`), fonts, global styles |
| `src/assets/` | Logo, mascots, badges and food photos |

## Supabase

Sign-in uses Supabase Auth: email and password, Google and Facebook, plus phone codes when SMS is switched on.
Groups use the `groups` and `group_members` tables and the `create_group`, `join_group` and `leave_group` functions.

## History

This project was rebuilt in October 2026 from the live site after the original folder was deleted.
Every page was checked against the old site, and they match pixel for pixel.
