# Building the Project

This project uses Next.js and Tailwind CSS.

## Build Steps

To create a production build, run:

```bash
npm run build
```

## Troubleshooting Build Issues

If you encounter `EPERM` or `EISDIR` errors during build:

1. Stop any running development servers.
2. Delete the `.next` directory: `rm -rf .next` (on Windows: `rmdir /s /q .next`).
3. Ensure no other processes are locking files in the project directory.
4. Run `npm run build` again.

## Deployment

Deploy to Firebase App Hosting:

```bash
firebase deploy
```
