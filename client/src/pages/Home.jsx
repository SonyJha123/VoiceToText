import React, { useState, useEffect, useRef } from "react";
import '../App.css';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();

  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Lets Say Something');
  const [transcription, setTranscription] = useState([])
  const [keywords, setKeywords] = useState([]); 
  const [error, setError] = useState(''); 
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const silenceTimerRef = useRef(null); 
  const [selectedKeywords, setSelectedKeywords] = useState([]);


  // Use useRef to store the recognition object
  const recognitionRef = useRef(null);
  const handleKeywordClick = (index) => {
    setSelectedKeywords((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((item) => item !== index) // Deselect if already selected
        : [...prevSelected, index] // Select if not already selected
    );
  };
  useEffect(() => {
    setKeywords([]);
    setTranscription()
  }, []); // Runs once on component mount
  


 


useEffect(() => {
  const resetState = () => {
    
    setTranscription(''); // Clear transcription state
    setKeywords([]); // Clear keywords state
    setIsRecording(false); // Reset recording state
    setStatus('Let\'s Talk Now & Get Started'); // Reset status message
  };

  resetState();
}, []);






  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser.');
      setStatus('Speech Recognition is not supported in this browser.');
      return;
    }






    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Set language as needed
    recognition.interimResults = true;
    recognition.continuous = false; // Disable continuous mode to stop after each speech
    recognitionRef.current = recognition;  // Store the recognition instance in the ref

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscription(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      setStatus(`Error: ${event.error}`);
      setIsRecording(false);
    };


    // Stop recording after 2 seconds of silence
    recognition.onspeechend = () => {
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
        setIsRecording(false);
        setStatus('Preparing result for you!');
      }, 2000); // Stop recording after 2 seconds of silence
    };

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

    };
  }, []);




  // Handle mic click
  const handleMicClick = () => {
    setIsTextVisible(false); // Hide text smoothly
    const recognition = recognitionRef.current;

    if (!isRecording) {
      
      recognition.start();
      setStatus('Listening... Speak now!');
      setIsRecording(true);
    } else {
      recognition.stop();
      setStatus('Press the microphone to start speaking again.');
      setIsRecording(false);
    }


  };




  const fetchKeywordsFromSpeech = async () => {
    try {
      console.log(transcription,'Fetching keywords...');
      const url = `http://localhost:8004/collaborates/kewwords_from_text?speechText=${encodeURIComponent(transcription)}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch keywords: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      
      if (data.finalkeywords) {
        console.log('Keywords:', data.finalkeywords);
        setKeywords(data.finalkeywords); // Update keywords state
        setError(''); // Clear any previous error
      } else {
        console.error('No "keywords" field in API response:', data);
        setError('No keywords found in the response.');
      }
    } catch (error) {
      console.error('Error fetching keywords:', error);
      setError('An error occurred while fetching keywords.');
    }
  };



  useEffect(() => {
    // Fetch keywords automatically when transcription is updated
    if (transcription) {
      fetchKeywordsFromSpeech();
    }
  }, [transcription]);









  // Function to send transcription to API
  const sendTranscriptionToAPI = async () => {
    try {
      const response = await fetch('http://localhost:8004/userQuerys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery: transcription,  // Sending transcription as userQuery
          userId: '675a767cc122f174d61a000a', // Example userId, replace with actual
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send transcription');
      }

      const data = await response.json();
      console.log('API response:', data);
    } catch (error) {
      // console.error('Error sending transcription:', error);
    }
  };

  // Call sendTranscriptionToAPI whenever transcription updates
  useEffect(() => {
    if (transcription && transcription !== 'Your voice text will appear here') {
      sendTranscriptionToAPI();
    }
  }, [transcription]);

  const handleShowCollaborators = () => {
    navigate('/collaborators');
  };


  return (
    <>
      <div className="min-h-screen outer">
        <header>
          <nav className="bg-[#010C2C]">
            <div className="container max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-[300px]">
              <a className="text-[30px] font-bold text-white" href="#">
                LOGO
              </a>
              <button
                className="lg:hidden text-gray-700"
                onClick={() => setIsOpen(!isOpen)} // Toggle the state
                aria-controls="navbarNav"
                aria-expanded={isOpen}
                aria-label="Toggle navigation"
              >
                <span className="material-icons">menu</span>
              </button>
              <div
                className={isOpen ? "block lg:flex w-full lg:w-auto items-center gap-[100px]" : "hidden lg:flex w-full lg:w-auto items-center gap-[100px]"}
                id="navbarNav"
              >
                <ul className="flex flex-col lg:flex-row gap-[100px]">
                  <li>
                    <a
                      className="text-slate-100 hover:text-blue-500 active:text-blue-700"
                      href="#"
                    >
                      About us
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-slate-100 hover:text-blue-500"
                      href="#"
                    >
                      Solutions
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-slate-100 hover:text-blue-500"
                      href="#"
                    >
                      Our Team
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-slate-100 "
                      href="#"
                    >
                      Contact us
                    </a>
                  </li>
                </ul>
                <form>
                  <button
                    type="button"
                    // onClick={onClick}
                    className="px-4 py-2 bg-white text-black font-semibold rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Talk to Us
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </header>

        <section className="h-[80vh] flex justify-center items-center">
          <div className="container mx-auto px-4 py-3">
            <div className="text w-8/12 mx-auto">
              <div
                className={`outer_text transition-all duration-700 ease-in-out ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20 pointer-events-none'
                  }`}
              >
                <h2 className="text-white text-center text-[40px] font-semibold">We assure an interaction with anyone you need</h2>
                <p className="text-white text-center font-normal text-[16px]">
                  Tired of LinkedIn, Just Dial Lusha, Google, Signal Hire etc? <br />
                  We believe life should be simpler for businesses<br />
                  <b>1694 requests & 1272 successful introductions and we have just got started</b>
                </p>
              </div>

              <div
                className={`flex flex-col items-center justify-center mt-4 transition-transform duration-700 ease-in-out ${isTextVisible ? '' : '-translate-y-10'
                  }`}
              >
<div className="flex items-center justify-center gap-4">
  {/* Conditional rendering of the voice wave */}
  {isRecording && (
    <div className="voiceWave">
      <div className="wave-container">
        <span className="wave"></span>
        <span className="wave"></span>
        <span className="wave"></span>
        <span className="wave"></span>
        <span className="wave"></span>
      </div>
    </div>
  )}

  {/* Microphone button */}
  <button
    id="mic-button"
    onClick={handleMicClick}
    className="w-36 h-36 rounded-full flex items-center justify-center transition-transform duration-300 relative bg-[rgba(1,12,44,0.25)]"
  >
    <div className="absolute inset-0 bg-[rgba(1,12,44,1)] rounded-full h-[100px] w-[100px] z-[1] flex justify-center items-center m-auto top-0 left-0 right-0">
      <svg
        width="58"
        height="58"
        viewBox="0 0 58 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.7623 43.7769V43.7655C43.9994 43.7655 49.8782 37.8753 49.8782 30.6496C49.8782 29.7592 49.159 29.04 48.2687 29.04C47.3783 29.04 46.6591 29.7592 46.6591 30.6496C46.6591 36.106 42.2187 40.5464 36.7623 40.5464H21.2377C15.7813 40.5464 11.3409 36.106 11.3409 30.6496C11.3409 29.7592 10.6217 29.04 9.73135 29.04C8.84098 29.04 8.12183 29.7592 8.12183 30.6496C8.12183 37.8867 14.012 43.7655 21.2377 43.7655H27.3905V48.3315H23.2011C18.7607 48.3315 15.1421 51.9501 15.1421 56.3906C15.1421 57.2809 15.8612 58.0001 16.7516 58.0001C16.7516 58.0001 41.237 58.0001 41.2484 58.0001C42.9378 58.0001 42.8465 56.2193 42.8351 56.1394C42.6981 51.8131 39.1366 48.3429 34.7874 48.3429H30.5981V43.7769H36.7623ZM34.7989 51.5506C36.8992 51.5506 38.6914 52.8975 39.3535 54.7696H18.6465C19.3086 52.8975 21.1008 51.5506 23.2011 51.5506H34.7989Z"
          fill="white"
        />
        <path
          d="M36.7623 0H21.2378C17.5507 0 14.5599 2.99075 14.5599 6.67782V30.6381C14.5599 34.3251 17.5621 37.3159 21.2378 37.3159H36.7623C40.4493 37.3159 43.4401 34.3251 43.4401 30.6381V6.67782C43.4401 2.99075 40.4379 0 36.7623 0ZM40.221 10.1252H36.1344C35.2441 10.1252 34.5249 10.8443 34.5249 11.7347C34.5249 12.6251 35.2441 13.3442 36.1344 13.3442H40.221V17.0427H36.1344C35.2441 17.0427 34.5249 17.7619 34.5249 18.6522C34.5249 19.5426 35.2441 20.2618 36.1344 20.2618H40.221V23.9717H36.1344C35.2441 23.9717 34.5249 24.6908 34.5249 25.5812C34.5249 26.4716 35.2441 27.1907 36.1344 27.1907H40.221V30.6381C40.221 32.5444 38.6686 34.0968 36.7623 34.0968H21.2378C19.3314 34.0968 17.779 32.5444 17.779 30.6381V27.1907H21.8656C22.756 27.1907 23.4751 26.4716 23.4751 25.5812C23.4751 24.6908 22.756 23.9717 21.8656 23.9717H17.779V20.2732H21.8656C22.756 20.2732 23.4751 19.554 23.4751 18.6636C23.4751 17.7733 22.756 17.0541 21.8656 17.0541H17.779V13.3556H21.8656C22.756 13.3556 23.4751 12.6365 23.4751 11.7461C23.4751 10.8557 22.756 10.1366 21.8656 10.1366H17.779V6.67782C17.779 4.7715 19.3314 3.21905 21.2378 3.21905H36.7623C38.6686 3.21905 40.221 4.7715 40.221 6.67782V10.1252Z"
          fill="white"
        />
      </svg>
    </div>
  </button>

  {isRecording && (
    <div className="voiceWave">
      <div className="wave-container">
        <span className="wave"></span>
        <span className="wave"></span>
        <span className="wave"></span>
        <span className="wave"></span>
        <span className="wave"></span>
      </div>
    </div>
  )}

</div>



                <p className="mt-4 text-white text-lg">{status}</p>
                <div className="text-white text-base text-center p-2 shadow-sm w-3/4">
                  {transcription}
                </div>
                <div className="p-6">
  {console.log(keywords, 'keywords33333333333333333')}
  <div className={keywords.length > 0 ? '' : 'hidden'}>
  {/* Flex Container for Heading and Button */}
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-semibold text-white">Filtered topics</h3>
    {/* {selectedKeywords.length > 0 && (
      <button onClick={handleShowCollaborators}
        className="px-5 py-2 bg-[#312e81] text-white font-medium rounded-lg hover:bg-[#2D6EDB] transition-all shadow-md transform hover:scale-105 focus:outline-none"
        style={{ marginLeft: '10px' }}
      >
        Show Result
      </button>
    )} */}
  </div>

  {/* Keywords List */}
  <div className="flex flex-wrap gap-3">
    {keywords.map((keyword, index) => (
      <button
        key={index}
        onClick={() => handleKeywordClick(index)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none ${
          selectedKeywords.includes(index)
            ? 'bg-blue-500 text-white'
            : 'bg-[rgba(88,88,88,0.5)] text-white'
        }`}
      >
        {keyword}
      </button>
    ))}
  </div>
  {selectedKeywords.length > 0 && (
      <div className="flex justify-center">
   <button onClick={handleShowCollaborators}
  className="px-5 py-2 bg-[rgb(1,12,44)] text-[rgba(255,255,255,1)] font-medium rounded-lg hover:bg-[rgb(1,12,44)]/80 transition-all shadow-md transform hover:scale-105 focus:outline-none mt-5"
>
  Show Result
</button>


      </div>
    )}
</div>


  {keywords.length === 0 && <p className="text-white"></p>}
</div>


              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
