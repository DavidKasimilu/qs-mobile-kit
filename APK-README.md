# Building the APK

1. Copy everything in this kit into the ROOT of your qs-pos-mobile repo
   (.github/, scripts/, package.json, capacitor.config.json, .gitignore).
   If you already have a .gitignore, merge the lines instead of replacing it.
2. Commit and push to `main`.
3. On GitHub: Actions tab -> "Build Android APK" -> open the latest run.
4. Download the `quicksell-pos-apk` artifact (zip), unzip, and install app-debug.apk on your phone.

You can also trigger it manually with "Run workflow".
