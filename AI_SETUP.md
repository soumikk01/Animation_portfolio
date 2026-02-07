# AI Assistant Setup Instructions

## 🚀 Quick Start

Your AI Assistant is now integrated! Follow these steps to activate it:

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### 2. Configure Environment Variables

1. Create a `.env` file in the project root:

   ```bash
   # In the Animation_portfolio directory
   copy .env.example .env
   ```

2. Open `.env` and add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Restart Development Server

Since environment variables are loaded at build time, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### 4. Test the AI Assistant

- Visit the bottom section of your portfolio
- Try asking: "What technologies do you work with?"
- The AI will respond with information about your portfolio!

## 🎨 Features

✅ **Gemini AI Integration** - Powered by Google's latest AI model
✅ **Portfolio Context** - AI knows about your skills and projects  
✅ **Glassmorphism Design** - Matches your site's aesthetic
✅ **Purple Theme** - Consistent with your brand colors
✅ **Responsive** - Works on all devices
✅ **Smooth Animations** - Bubble effects and typing indicators

## 🔒 Security

- ✅ `.env` file is gitignored (won't be committed)
- ✅ API key stays on client-side (for demo purposes)
- 📝 **Note**: For production, consider using a backend proxy to hide your API key

## 💡 Customization

Want to modify the AI's knowledge? Edit the `portfolioContext` in `src/components/AIAssistant.jsx` around line 26 to add more details about your work!

## ❓ Troubleshooting

**"API key not configured" message?**

- Make sure `.env` file exists in root directory
- Verify the key is named `VITE_GEMINI_API_KEY`
- Restart the dev server after creating/editing `.env`

**AI not responding?**

- Check browser console for errors
- Verify your API key is valid
- Ensure you have internet connection

---

🎉 **You're all set!** Enjoy your new AI-powered portfolio assistant!
