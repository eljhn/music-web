# MUSIC WEB

A custom web-based audio player with synchronized lyrics display. This project allows you to display song lyrics line by line, highlight the current line based on audio progress, and scroll lyrics smoothly.

---

## Features

- Click on a song to open a modal player.
- Background video changes when hovering over a song.
- Plays audio with play/pause and volume controls.
- Shows lyrics synchronized with audio (`data-lyrics` JSON).
- Each line has a start time and duration for highlighting.
- Smooth auto-scrolling lyrics.
- Keyboard support: Spacebar toggles play/pause.

---

## HTML Setup

Each song is an `<article>` with `data-*` attributes:

```html
<article class="song" 
         data-title="Song Title"
         data-singer="Artist Name"
         data-img="img/song.jpg"
         data-video="video/song.mp4"
         data-audio="audio/song.mp3"
         data-lyrics='[
           {"time":0, "line":"First line of lyrics", "duration":3},
           {"time":3, "line":"Second line of lyrics", "duration":3},
           {"time":6, "line":"Third line of lyrics", "duration":3}
         ]'>
  <img src="img/song.jpg" alt="Thumbnail">
  <div>
    <div class="text-base font-semibold">Song Title</div>
    <div class="text-xs opacity-70 mt-1">Artist Name</div>
  </div>
</article>
time: The start time in seconds when the lyric should be highlighted.

duration: How long the line stays highlighted (in seconds).

JavaScript Setup
The core functionality is in player.js:

Handles modal open/close.

Plays audio and updates progress.

Highlights current lyric line according to time and duration.

Smoothly scrolls lyrics to keep the current line centered.

Toggles play/pause buttons and volume.

javascript
Copy code
// Example snippet
modalAudio.addEventListener('timeupdate', () => {
  highlightLyrics(modalAudio.currentTime);
});

function highlightLyrics(currentTime){
  // Checks which line to highlight based on time
}
Styling
Uses CSS for modal, lyric highlighting, and transitions.

Highlighted lyrics use .lyric-active class.

Supports smooth scrolling inside the lyrics wrapper.

Adding a New Song
Add a new <article> element with proper data-* attributes.

Provide a data-lyrics JSON array with time, line, and duration.

Add the corresponding audio file, thumbnail, and video if available.

Keyboard Support
Press Spacebar to toggle play/pause.

Works only if the focus is not on an input or textarea.

Notes
Lyrics must be parsed as JSON in data-lyrics.

time is in seconds; duration defines how long the line is highlighted.

Ensure all media files are correctly linked for the modal to work.

License
This project is for educational purposes. Adapt and modify it for your own projects.