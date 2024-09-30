import { useState, useEffect, createContext } from 'react';
import dialoguesData from '../dialogues.json';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const initialDialogues = dialoguesData.map(dialogue => ({ ...dialogue, audio: null })); // Add audio: null initially to each dialogue
    const [dialogues, setDialogues] = useState(initialDialogues);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    useEffect(() => {
        console.log("Context Dialogues:", dialogues); // For debugging
    }, [dialogues]);

    const currentDialogue = dialogues[currentDialogueIndex];

    // Function to update the current dialogue in the state
    const setCurrentDialogue = (updatedDialogue) => {
        setDialogues(prevDialogues => {
            const updatedDialogues = [...prevDialogues];
            updatedDialogues[currentDialogueIndex] = updatedDialogue;
            return updatedDialogues;
        });
    };

    // Function to set the audio blob for the current dialogue 
    // and update the general audioBlob state 
    const setAudioForCurrentDialogue = (audioBlob, dialogue) => {
        setDialogues(prevDialogues => {
            const updatedDialogues = [...prevDialogues];
            const index = updatedDialogues.indexOf(dialogue); // Find the index of the dialogue object
            updatedDialogues[index] = { ...updatedDialogues[index], audio: audioBlob };
            return updatedDialogues;
        });
        setAudioBlob(audioBlob);
    };

    const contextValue = {
        dialogues,
        setDialogues, 
        currentDialogue, 
        setCurrentDialogue,
        currentDialogueIndex, 
        setCurrentDialogueIndex,
        isRecording, 
        setIsRecording, 
        audioBlob, 
        setAudioBlob,
        setAudioForCurrentDialogue // Make sure this function is included in the context
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};