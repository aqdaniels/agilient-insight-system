
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GenAIAccelerator } from '../features/genai/types';

// Define the context state interface
interface AppContextState {
  // GenAI Accelerators
  accelerators: GenAIAccelerator[];
  addAccelerator: (accelerator: GenAIAccelerator) => void;
  updateAccelerator: (accelerator: GenAIAccelerator) => void;
  deleteAccelerator: (id: string) => void;
  selectedAcceleratorId: string | null;
  setSelectedAcceleratorId: (id: string | null) => void;
  
  // Team configurations
  teamSize: number;
  setTeamSize: (size: number) => void;
  
  // Navigation state
  lastVisitedRoute: string;
  setLastVisitedRoute: (route: string) => void;
}

// Create the context
const AppContext = createContext<AppContextState | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // GenAI Accelerators state
  const [accelerators, setAccelerators] = useState<GenAIAccelerator[]>([]);
  const [selectedAcceleratorId, setSelectedAcceleratorId] = useState<string | null>(null);
  
  // Team configurations state
  const [teamSize, setTeamSize] = useState<number>(5);
  
  // Navigation state
  const [lastVisitedRoute, setLastVisitedRoute] = useState<string>('/');

  // Load saved data from local storage on initial mount
  useEffect(() => {
    try {
      const savedAccelerators = localStorage.getItem('accelerators');
      if (savedAccelerators) {
        setAccelerators(JSON.parse(savedAccelerators));
      }
      
      const savedTeamSize = localStorage.getItem('teamSize');
      if (savedTeamSize) {
        setTeamSize(Number(savedTeamSize));
      }
    } catch (error) {
      console.error("Error loading data from local storage:", error);
    }
  }, []);

  // Save data to local storage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('accelerators', JSON.stringify(accelerators));
    } catch (error) {
      console.error("Error saving accelerators to local storage:", error);
    }
  }, [accelerators]);

  useEffect(() => {
    try {
      localStorage.setItem('teamSize', String(teamSize));
    } catch (error) {
      console.error("Error saving team size to local storage:", error);
    }
  }, [teamSize]);

  // Accelerator methods
  const addAccelerator = (accelerator: GenAIAccelerator) => {
    setAccelerators(prev => [...prev, accelerator]);
  };

  const updateAccelerator = (accelerator: GenAIAccelerator) => {
    setAccelerators(prev => prev.map(acc => 
      acc.id === accelerator.id ? accelerator : acc
    ));
  };

  const deleteAccelerator = (id: string) => {
    setAccelerators(prev => prev.filter(acc => acc.id !== id));
  };

  // Create value object
  const value: AppContextState = {
    accelerators,
    addAccelerator,
    updateAccelerator,
    deleteAccelerator,
    selectedAcceleratorId,
    setSelectedAcceleratorId,
    teamSize,
    setTeamSize,
    lastVisitedRoute,
    setLastVisitedRoute
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
