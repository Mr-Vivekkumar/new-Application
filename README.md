# Dubbing Application

This is a React application that allows users to dub videos by recording audio against specific dialogue segments. 

## Features

* **Video Player:** Plays a video with a seek bar and current time display.
* **Audio Recorder:** Records audio using the user's microphone.
* **Dialogue Display:** Shows the original and translated text for each dialogue segment, allowing users to edit and re-record the audio.
* **Timeline:** A visual timeline for navigating dialogue segments. 
* **Navigation:** Buttons to move between dialogues.
* **Audio Merging:**  Combines all recorded audio segments into a single downloadable WAV file.
* **Audio Playback Modes:** Allows users to choose between playing the original video audio, recorded audio, or both simultaneously.

## Running the Application Locally

1. **Clone the Repository:** `git clone https://github.com/your-username/your-repo-name.git`
2. **Navigate to the Project Directory:** `cd your-repo-name`
3. **Install Dependencies:** `npm install`
4. **Start the Development Server:** `npm start` The application should now be running in your browser at `http://localhost:3000`.

## Functionality Details

**1. Video Player:** - Plays a selected video with controls for play/pause, seeking, and displaying the current time.
**2. Audio Recorder:** - Records audio from the user's microphone and saves the recording as a blob associated with the current dialogue.
**3. Dialogue Display:** - Shows the original and translated text for the current dialogue segment. Allows editing of the text and re-recording of the audio.
**4. Timeline:** - Displays a visual timeline of dialogue segments, allowing users to navigate between them and see their distribution in the video. 
**5. Navigation:** - "Previous" and "Next" buttons to move between dialogue segments in the table.
**6. Dialogue Table:** - Lists all dialogue segments with their original text, translated text, and a "Play" button for each recorded audio. Includes a "Merge Audio" button to combine all recorded audio into a single downloadable WAV file.
**7. Audio Playback Modes:** - Provides buttons to choose between playing: - "Video Audio Only" - "Recorded Audio Only" (synchronized with the video) - "Both (Mixed)" (Not yet fully implemented)
**8. Audio Merging:** - The `mergeAudioBlobs` function in `AppContext.jsx` combines all recorded audio segments into a single WAV audio file that the user can download. 

## Additional Notes:

* Make sure to create a `dialogues.json` file in the `src` directory with your actual dialogue data, including the `startTime`, `endTime`, `original`, and `translated` properties for each segment.
* You will need to have a microphone connected and grant the browser permission to access it for recording to work.