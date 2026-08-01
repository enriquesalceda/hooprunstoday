# Design handoff drop zone

Drop Claude-design handoff ZIPs here, then run:

```
/design-handoff <commit message>
```

The skill replaces `design/` wholesale with the zip's contents (the zip is a
complete snapshot, not a patch), shows `git diff --stat` for review, commits
with your message, and deletes the zip afterward.

Zips in this folder are gitignored — only this README is tracked.
