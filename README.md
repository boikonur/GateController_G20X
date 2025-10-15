# G202 SMS Web Controller

A simple React web app that allows you to control your G202 GSM gate opener via SMS commands directly from your phone.

## 🚀 Features
- Add, delete, and manage users (alias + slot)
- Send commands to open/close gate, factory reset, enable/disable notifications
- Set relay time easily from dropdown
- Persistent settings via browser local storage
- Works directly on mobile browsers (opens SMS app with message prefilled)

## 🛠️ Deploy on GitHub Pages (Free)

1. In your project folder, add this to **package.json**:
   ```json
   "homepage": "https://yourusername.github.io/g202-sms-app"
   ```

2. Install dependencies and deploy tool:
   ```bash
   npm install
   npm install gh-pages --save-dev
   ```

3. Add scripts to **package.json**:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. Push your code to GitHub and deploy:
   ```bash
   npm run deploy
   ```

5. Visit: https://yourusername.github.io/GateController_G20X

## 📱 Usage
- Open the web app on your iPhone or Android phone.
- Set your **Device Number** and **Password** (default 1138).
- Tap any button (e.g., Open Gate) → your SMS app opens with the command ready.
- Send the SMS to your G202 device.

---

Made for smart control of G202 GSM gate openers.
