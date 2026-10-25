# Guest article reading and member attachments

Requested by Zin on 25/10/2026. Articles, home/category lists and search are public. Only the three explicit `forum_guest_*` RPCs expose reading data. Existing table grants, member profile/AI/feedback APIs and write APIs remain restricted. Public author data is limited to ID, name and badge; guests do not get member bios, a profile directory, comments, attachment names/paths or role membership lists. Count summaries remain public. Retained duplicates of merged series are omitted at the server and canonical links retain tabs.

An authenticated non-anonymous member can comment through the existing form/API. A new restrictive INSERT policy rejects anonymous Auth identities. Guest prompts link to login/register and retain the article destination. Signout clears member DOM and pending member results, then reloads public reading data.

Attachments use private `forum-resources` Storage. `forum_attachments` records immutable source, usage conditions and original editor stamped by the database. Only existing admins can register a draft or approve/withdraw one. File replacement requires a new record and path. All files require Zin's separate review before publication; this deployment uploads **no files**. An image illustrating an article is public with that article; it is not a protected downloadable attachment. Official external legal sources remain open.

Member metadata and Storage reads require a real identity and approval. Restrictive bucket policies defend against unrelated legacy permissive policies; clients cannot overwrite/delete stored versions. Allowed formats are PDF, DOCX, XLSX, PNG and JPEG, maximum 10 MiB; no macros or active HTML. Metadata is fixed per version. Registering/uploading files is an admin database/Storage operation for now, not a public upload feature.

The frontend revalidates membership and approval, uses authenticated `storage.download`, verifies the session epoch again after the request, and creates a short-lived local Blob URL for viewing or downloading. No public Storage URL or signed bearer URL is generated. Signing out/withdrawing blocks new downloads; files a member already received cannot be recalled. Article copy restrictions remain a deterrent and cannot prevent screenshots/OCR or extraction by a determined visitor.

Apply `supabase/009_guest_read_attachments.sql` before deploying the frontend. The migration is repeatable and does not rewrite article content, upload an input document or change account roles. Integration tests exercise SQL RLS under anon/member/admin and anonymous Auth identities, including an intentionally broad legacy Storage policy. Previous security tests still validate existing member-only APIs.

Primary API references: [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control), [authenticated download](https://supabase.com/docs/reference/javascript/storage-from-download).
