# Live announcements: Google Sheet setup

One-time setup, about 15 minutes. After this, volunteers post announcements by adding a row to a
Google Sheet, and the app shows it within about a minute. No GitHub access is needed to post.

## 1. Create the sheet

1. Sign in to the Google account that should **own** the announcements (preferably an organization
   account, not a personal one — the sheet and its script belong to whoever creates them).
2. Go to [sheets.new](https://sheets.new) to create a blank spreadsheet.
3. Name it, e.g. **Centenario 2026 — Avisos**.

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete the sample code in `Code.gs` and paste the entire contents of
   [`google-apps-script/Code.gs`](../google-apps-script/Code.gs).
3. Click **Save** (disk icon).
4. In the function dropdown at the top, choose **`setup`** and click **Run**.
5. Google asks for permission the first time: **Review permissions** → choose your account →
   if you see "Google hasn't verified this app", click **Advanced → Go to (project name)** →
   **Allow**. (It's your own script; the warning is standard for personal scripts.)
6. Back in the sheet, an **Avisos** tab now has the columns, checkboxes, the Type dropdown and the
   three current announcements.

## 3. Publish the web app

1. In the Apps Script editor: **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
4. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).

"Anyone" only allows *reading* the announcements through that URL. Editing still requires edit
access to the sheet itself.

To check it, open the URL in a browser — you should see the announcements as JSON text.

## 4. Connect the app

Send the `/exec` URL to whoever maintains the app, or set it yourself:

- GitHub repo → **Settings → Secrets and variables → Actions → Variables → New repository
  variable**: name `ANNOUNCEMENTS_URL`, value the `/exec` URL.
- Then **Actions → Deploy to GitHub Pages → Run workflow** (or push any change).

or with the GitHub CLI:

```sh
gh variable set ANNOUNCEMENTS_URL --body "https://script.google.com/macros/s/…/exec"
gh workflow run deploy.yml
```

## 5. Share with volunteers

In the sheet: **Share** → add each volunteer's email as **Editor**. Send them
[`announcements-guide.md`](announcements-guide.md).

## Good to know

- **Editing the script later:** after changing `Code.gs`, use **Deploy → Manage deployments →
  (pencil) → Version: New version → Deploy**. This keeps the same URL; a *New deployment* would
  create a different URL and the app would need updating.
- **Speed:** the feed is cached for 20 seconds and cleared on every edit; open apps check every
  60 seconds and whenever they're reopened.
- **If the sheet is unreachable,** the app keeps showing the last announcements it loaded (first
  time visitors see the announcements bundled with the app in `public/data/announcements.json`).
- **Don't rename** the `Avisos` tab or reorder its columns; the script reads them by position.
