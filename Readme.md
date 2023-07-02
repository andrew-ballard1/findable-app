To run local hot reloading server: npx expo start (then hit 'w', or 'i')
To build local app to run via xcode: npx expo run:ios (should create ios folder and rebuild the actual app)
To build local app in release configuration (will for sure build ios folder, closest match to running on a device we can get): npx expo run:ios --configuration Release

build internal distribution (skip app store verification): eas build --profile preview