import { useState, useCallback } from 'react';
import { Message, ChatState } from '@/types';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  
  const { toast: uiToast } = useToast();

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Update state with user message
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));
    
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate a response after a short delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API response
      const response = await simulateApiResponse(text);
      
      // If there's an error, throw it
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Create AI message from response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      // Update state with AI response
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error toast
      toast.error('Failed to get a response', {
        description: 'Please try again later',
      });
      
      // Update state with error
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  }, []);
  
  const resetChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
    
    toast.success('Chat history cleared');
  }, []);
  
  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    resetChat,
  };
};

// Helper function to simulate API response
// In a real implementation, this would be replaced with actual API calls
const simulateApiResponse = async (text: string): Promise<{ text: string; error?: string }> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple response logic based on user input
  if (text.toLowerCase().includes('error')) {
    return { text: '', error: 'Simulated error response' };
  }
  
  if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
    return { text: "Hello! I'm your AI assistant powered by a language model backend. How can I help you today?" };
  }
  
  if (text.toLowerCase().includes('how are you')) {
    return { text: "I'm functioning well, thank you for asking! I'm here to assist you with information or tasks. What can I help you with?" };
  }
  
  if (text.toLowerCase().includes('weather')) {
    return { text: "I don't have real-time weather data. In a full implementation, I would connect to a weather API to provide current weather information for your location." };
  }
  
  if (text.toLowerCase().includes('backend') || text.toLowerCase().includes('llm')) {
    return { text: "This chat interface is designed to connect to a language model backend. In a complete implementation, your messages would be sent to an API that processes them using a language model like GPT-4, Claude, or an open-source alternative running on your own infrastructure." };
  }
  
  // Default response
  return { 
    text: "Thanks for your message. In a complete implementation, this response would come from a language model API backend that could provide more contextual and helpful responses. I'm currently running in demo mode with pre-defined responses." 
  };
};

export default useChat;
