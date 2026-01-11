# Troubleshooting Guide - Admin Dashboard Upload Issues

## Common Issues When Uploading Slides/Projects

### 1. "Error saving content" - Server Not Running
**Problem:** The backend server is not running on port 5000.

**Solution:**
```bash
# Navigate to server directory
cd server

# Start the server
npm start
# or
node server.js
```

**Check:** You should see:
```
✅ Connected to MongoDB
🚀 Server is running on port 5000
```

---

### 2. MongoDB Connection Issues
**Problem:** MongoDB is not running or not connected.

**Solution:**
- **Windows:** Make sure MongoDB service is running
  - Open Services (Win + R, type `services.msc`)
  - Find "MongoDB" service and start it
  
- **Alternative:** Check your `.env` file in the `server` folder:
  ```
  MONGODB_URI=mongodb://localhost:27017/varsha-pradeep
  ```

---

### 3. Image Size Too Large
**Problem:** Base64 encoded images exceed the server limit.

**Solution:**
- The server now accepts up to 100MB
- Try compressing your images before upload
- Recommended image size: < 5MB per image
- Use tools like TinyPNG or compress images before uploading

---

### 4. CORS Issues
**Problem:** Cross-Origin Resource Sharing blocked.

**Solution:**
- Make sure the server has CORS enabled (already configured)
- Check that you're accessing from `http://localhost:5173` (or your Vite dev server port)

---

### 5. Missing Required Fields
**Problem:** Not all required fields are filled.

**For Home Slides:**
- ✅ Description (testimonial text)
- ✅ Author (name)
- ✅ Background Image

**For Projects:**
- ✅ Title
- ✅ Description
- ✅ Category
- ✅ At least one image
- ⚪ Location (optional)
- ⚪ Year (optional)
- ⚪ Client (optional)

---

## How to Debug

### Step 1: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check the Network tab for failed requests

### Step 2: Check Server Logs
1. Look at the terminal where the server is running
2. Check for error messages
3. Look for MongoDB connection status

### Step 3: Test API Endpoints
Use a tool like Postman or curl to test:

```bash
# Test if server is running
curl http://localhost:5000

# Test getting home content
curl http://localhost:5000/api/home-content

# Test getting projects
curl http://localhost:5000/api/projects
```

---

## Quick Start Checklist

Before uploading slides/projects, ensure:

- [ ] MongoDB is running
- [ ] Backend server is running (`cd server && npm start`)
- [ ] Frontend dev server is running (`npm run dev`)
- [ ] You're logged in as admin
- [ ] Images are not too large (< 5MB recommended)
- [ ] All required fields are filled

---

## Error Messages Explained

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Network Error" | Can't reach server | Start the backend server |
| "Missing required fields" | Form incomplete | Fill all required fields |
| "At least one image is required" | No images uploaded | Upload at least one image |
| "Error 413: Payload Too Large" | Image too big | Compress the image |
| "Error 500: Internal Server Error" | Server/DB issue | Check MongoDB connection |

---

## Still Having Issues?

1. **Restart everything:**
   ```bash
   # Stop all servers (Ctrl+C)
   # Restart MongoDB service
   # Start backend: cd server && npm start
   # Start frontend: npm run dev
   ```

2. **Clear browser cache:**
   - Hard refresh: Ctrl + Shift + R
   - Clear localStorage: Open Console and run `localStorage.clear()`

3. **Check file permissions:**
   - Make sure you have write permissions to the project directory

4. **Check for port conflicts:**
   - Make sure port 5000 is not being used by another application
   - Make sure port 5173 (Vite) is not being used

---

## Contact
If issues persist, check the error message details in the browser console and server logs for more specific information.
