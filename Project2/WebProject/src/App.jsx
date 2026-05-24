import React, { useState, useEffect, useRef } from "react";

export default function App() {
  /* ========================= LESSON DATA ========================= */

const lessons = {
  Japanese: [
    {
      word: "こんにちは",
      correct: "Hello",
      question: "What does this mean?",
      
      sentence: "こんにちは、元気ですか？",
    },
    {
      word: "おはよう",
      correct: "Good Morning",
      question: "Choose the correct greeting",
      
      sentence: "おはようございます！",
    },
    {
      word: "こんばんは",
      correct: "Good Evening",
      question: "Translate this greeting",
      
      sentence: "こんばんは、今日はどうですか？",
    },
    {
      word: "ありがとう",
      correct: "Thank You",
      question: "What does this phrase mean?",
      sentence: "助けてくれてありがとう。",
    },
    {
      word: "すみません",
      correct: "Excuse Me",
      question: "Choose the correct meaning",
      sentence: "すみません、駅はどこですか？",
    },
    {
      word: "水",
      correct: "Water",
      question: "Choose the correct meaning",
      sentence: "私は水を飲みます。",
    },
    {
      word: "猫",
      correct: "Cat",
      question: "What animal is this?",
      sentence: "猫が好きです。",
    },
    {
      word: "友達",
      correct: "Friend",
      question: "Translate this word",
      sentence: "彼は私の友達です。",
    },
  ],

  Spanish: [
    {
      word: "Hola",
      correct: "Hello",
      question: "What does this mean?",
      sentence: "Hola amigo",
    },
    {
      word: "Buenos días",
      correct: "Good Morning",
      question: "Translate this greeting",
      sentence: "Buenos días, ¿cómo estás?",
    },
    {
      word: "Buenas noches",
      correct: "Good Night",
      question: "Choose the correct meaning",
      sentence: "Buenas noches, hasta mañana.",
    },
    {
      word: "Gracias",
      correct: "Thank You",
      question: "Translate this word",
      sentence: "Muchas gracias por tu ayuda.",
    },
    {
      word: "Perdón",
      correct: "Sorry",
      question: "Choose the correct answer",
      sentence: "Perdón por llegar tarde.",
    },
    {
      word: "Agua",
      correct: "Water",
      question: "Choose the correct meaning",
      sentence: "Necesito agua.",
    },
    {
      word: "Gato",
      correct: "Cat",
      question: "Which animal is this?",
      sentence: "El gato duerme.",
    },
    {
      word: "Amigo",
      correct: "Friend",
      question: "Translate this word",
      sentence: "Él es mi mejor amigo.",
    },
  ],

  French: [
    {
      word: "Bonjour",
      correct: "Hello",
      question: "Translate this word",
      sentence: "Bonjour mon ami",
    },
    {
      word: "Bonsoir",
      correct: "Good Evening",
      question: "Choose the correct greeting",
      sentence: "Bonsoir, comment allez-vous ?",
    },
    {
      word: "Merci",
      correct: "Thank You",
      question: "Translate this word",
      sentence: "Merci beaucoup pour votre aide.",
    },
    {
      word: "S'il vous plaît",
      correct: "Please",
      question: "What does this phrase mean?",
      sentence: "Un café, s'il vous plaît.",
    },
    {
      word: "Pardon",
      correct: "Sorry",
      question: "Choose the correct answer",
      sentence: "Pardon pour le retard.",
    },
    {
      word: "Eau",
      correct: "Water",
      question: "Choose the correct answer",
      sentence: "Je bois de l'eau.",
    },
    {
      word: "Chat",
      correct: "Cat",
      question: "Which animal is this?",
      sentence: "Le chat est mignon.",
    },
    {
      word: "Ami",
      correct: "Friend",
      question: "Translate this word",
      sentence: "Il est mon meilleur ami.",
    },
  ],
};

  /* ========================= STATES ========================= */

  const [darkMode, setDarkMode] = useState(false);

  const [xp, setXp] = useState(0);
  const [streak] = useState(18);
  const [hearts] = useState(5);

  const [selectedLanguage, setSelectedLanguage] =
    useState("Japanese");

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [feedback, setFeedback] = useState("");
  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [activeGame, setActiveGame] =
    useState(null);

  const [speedTimer, setSpeedTimer] =
    useState(5);

  const [speedRunning, setSpeedRunning] =
    useState(false);

  const [memoryQuestion, setMemoryQuestion] =
    useState(null);

  const [listeningQuestion, setListeningQuestion] =
    useState(null);

  const [speakingResult, setSpeakingResult] =
    useState("");

  const recognitionRef = useRef(null);

  /* ========================= CURRENT LESSON ========================= */

  const currentLessons = lessons[selectedLanguage];

  const currentLesson =
    currentLessons[
      questionIndex % currentLessons.length
    ];
  const generateOptions = () => {
  // Get all possible answers
  const allAnswers = currentLessons.map(
    (lesson) => lesson.correct
  );

  // Remove correct answer
  const wrongAnswers = allAnswers.filter(
    (answer) => answer !== currentLesson.correct
  );

  // Shuffle wrong answers
  const shuffledWrong = wrongAnswers.sort(
    () => Math.random() - 0.5
  );

  // Pick first 3 wrong answers
  const selectedWrong = shuffledWrong.slice(0, 3);

  // Combine with correct answer
  const finalOptions = [
    currentLesson.correct,
    ...selectedWrong,
  ];

  // Shuffle again
  return finalOptions.sort(
    () => Math.random() - 0.5
  );
};


  /* ========================= SPEECH ========================= */

  const speak = (text) => {
    if (!window.speechSynthesis) {
      alert("Speech not supported");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    if (selectedLanguage === "Japanese") {
      utterance.lang = "ja-JP";
    } else if (selectedLanguage === "Spanish") {
      utterance.lang = "es-ES";
    } else if (selectedLanguage === "French") {
      utterance.lang = "fr-FR";
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  /* ========================= ANSWERS ========================= */

  const handleAnswer = (option) => {
    setSelectedAnswer(option);

    if (option === currentLesson.correct) {
      setXp((prev) => prev + 10);
      setFeedback("🎉 Correct! +10 XP");
    } else {
      setFeedback("❌ Wrong Answer");
    }

    setTimeout(() => {
      setSelectedAnswer("");
      setFeedback("");
      setQuestionIndex((prev) => prev + 1);
    }, 1000);
  };

  /* ========================= TIMER ========================= */

  useEffect(() => {
    let timer;

    if (speedRunning && speedTimer > 0) {
      timer = setInterval(() => {
        setSpeedTimer((prev) => prev - 1);
      }, 1000);
    }

    if (speedTimer === 0 && speedRunning) {
      setSpeedRunning(false);
      setFeedback("⏰ Time Finished!");
    }

    return () => clearInterval(timer);
  }, [speedRunning, speedTimer]);

  /* ========================= MEMORY GAME ========================= */

  const generateMemoryQuestion = () => {
  const lesson =
    lessons[selectedLanguage][
      Math.floor(
        Math.random() *
          lessons[selectedLanguage].length
      )
    ];

  const allAnswers =
    lessons[selectedLanguage].map(
      (item) => item.correct
    );

  const wrongAnswers = allAnswers.filter(
    (answer) => answer !== lesson.correct
  );

  const shuffledWrong = [...wrongAnswers].sort(
    () => Math.random() - 0.5
  );

  const options = [
    lesson.correct,
    ...shuffledWrong.slice(0, 3),
  ].sort(() => Math.random() - 0.5);

  setMemoryQuestion({
    word: lesson.word,
    correct: lesson.correct,
    options,
  });
};

  /* ========================= LISTENING GAME ========================= */

  const generateListeningQuestion = () => {
  const lesson =
    lessons[selectedLanguage][
      Math.floor(
        Math.random() *
          lessons[selectedLanguage].length
      )
    ];

  const allAnswers =
    lessons[selectedLanguage].map(
      (item) => item.correct
    );

  const wrongAnswers = allAnswers.filter(
    (answer) => answer !== lesson.correct
  );

  const shuffledWrong = [...wrongAnswers].sort(
    () => Math.random() - 0.5
  );

  const options = [
    lesson.correct,
    ...shuffledWrong.slice(0, 3),
  ].sort(() => Math.random() - 0.5);

  setListeningQuestion({
    word: lesson.word,
    correct: lesson.correct,
    options,
  });
};
  /* ========================= SPEAKING ========================= */

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
      selectedLanguage === "Japanese"
        ? "ja-JP"
        : selectedLanguage === "Spanish"
        ? "es-ES"
        : selectedLanguage === "French"
        ? "fr-FR"
        : "en-US";

    recognition.start();

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript.toLowerCase();

      if (
        transcript.includes(
          currentLesson.word.toLowerCase()
        )
      ) {
        setXp((prev) => prev + 25);

        setSpeakingResult(
          "🎉 Excellent Pronunciation! +25 XP"
        );
      } else {
        setSpeakingResult(
          `❌ You said: "${transcript}"`
        );
      }
    };

    recognition.onerror = () => {
      setSpeakingResult(
        "❌ Microphone access denied"
      );
    };

    recognitionRef.current = recognition;
  };

  /* ========================= MEMORY PAGE ========================= */

  if (activeGame === "memory") {
    return (
      <GameWrapper darkMode={darkMode}>
        <BackButton setActiveGame={setActiveGame} />

        <GameCard darkMode={darkMode}>
          <h1>🧠 Memory Match</h1>

          <h2>Match the meaning:</h2>

          <h1 style={{ fontSize: 60 }}>
            {memoryQuestion?.word}
          </h1>

          <PrimaryButton
            color="#1cb0f6"
            onClick={() =>
              speak(memoryQuestion?.word)
            }
          >
            🔊 Hear Word
          </PrimaryButton>

          <Grid>
            {memoryQuestion?.options.map((option) => (
              <OptionButton
                 key={option}
                darkMode={darkMode}
                selected={
                  selectedAnswer === option
                }
                correct={
                  option === memoryQuestion.correct
               }
                onClick={() => {
                 setSelectedAnswer(option);
                  if (
                    option ===
                    memoryQuestion.correct
                  ) {
                    setXp((prev) => prev + 10);
                    setFeedback(
                      "🎉 Correct Match! +10 XP"
                    );
                  } else {
                    setFeedback("❌ Wrong Match");
                  }

                  setTimeout(() => {
                    generateMemoryQuestion();
                  }, 1000);
                }}
              >
                {option}
              </OptionButton>
            ))}
          </Grid>

          <h2>{feedback}</h2>
        </GameCard>
      </GameWrapper>
    );
  }

  /* ========================= SPEED PAGE ========================= */

  if (activeGame === "speed") {
    return (
      <GameWrapper darkMode={darkMode}>
        <BackButton setActiveGame={setActiveGame} />

        <GameCard darkMode={darkMode}>
          <h1>⚡ Speed Challenge</h1>

          <h1 style={{ fontSize: 60 }}>
            {currentLesson.word}
          </h1>

          <h1 style={{ fontSize: 90 }}>
            {speedTimer}
          </h1>

          <Grid>
            {generateOptions().map((option) => (
              <OptionButton
                key={option}
                darkMode={darkMode}
                onClick={() => {
                  if (!speedRunning) return;

                  if (
                    option === currentLesson.correct
                  ) {
                    setXp((prev) => prev + 15);

                    setFeedback(
                      "⚡ Super Fast! +15 XP"
                    );
                  } else {
                    setFeedback("❌ Wrong");
                  }

                  setSpeedRunning(false);
                }}
              >
                {option}
              </OptionButton>
            ))}
          </Grid>

          <PrimaryButton
            color="#1cb0f6"
            onClick={() => {
              setFeedback("");
              setSpeedTimer(5);
              setSpeedRunning(true);
            }}
          >
            Start Challenge
          </PrimaryButton>

          <h2>{feedback}</h2>
        </GameCard>
      </GameWrapper>
    );
  }

  /* ========================= LISTENING PAGE ========================= */

  if (activeGame === "listening") {
    return (
      <GameWrapper darkMode={darkMode}>
        <BackButton setActiveGame={setActiveGame} />

        <GameCard darkMode={darkMode}>
          <h1>🎧 Listening Challenge</h1>

          <PrimaryButton
            color="#8b5cf6"
            onClick={() =>
              speak(listeningQuestion?.word)
            }
          >
            🔊 Play Audio
          </PrimaryButton>

          <Grid>
            {listeningQuestion?.options.map(
              (option) => (
                <OptionButton
                  key={option}
                  darkMode={darkMode}
                  onClick={() => {
                    if (
                      option ===
                      listeningQuestion.correct
                    ) {
                      setXp((prev) => prev + 12);

                      setFeedback(
                        "🎧 Correct! +12 XP"
                      );
                    } else {
                      setFeedback("❌ Try Again");
                    }

                    setTimeout(() => {
                      generateListeningQuestion();
                    }, 1000);
                  }}
                >
                  {option}
                </OptionButton>
              )
            )}
          </Grid>

          <h2>{feedback}</h2>
        </GameCard>
      </GameWrapper>
    );
  }

  /* ========================= SPEAKING PAGE ========================= */

  if (activeGame === "speaking") {
    return (
      <GameWrapper darkMode={darkMode}>
        <BackButton setActiveGame={setActiveGame} />

        <GameCard darkMode={darkMode}>
          <h1>🎤 Pronunciation Practice</h1>

          <h1 style={{ fontSize: 60 }}>
            {currentLesson.word}
          </h1>

          <PrimaryButton
            color="#22c55e"
            onClick={() =>
              speak(currentLesson.word)
            }
          >
            🔊 Hear Pronunciation
          </PrimaryButton>

          <PrimaryButton
            color="#1cb0f6"
            onClick={startSpeechRecognition}
          >
            🎤 Start Speaking
          </PrimaryButton>

          <h2>{speakingResult}</h2>
        </GameCard>
      </GameWrapper>
    );
  }

  
  /* ========================= MAIN APP ========================= */
  
  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode
  ? "#111827"
  : "linear-gradient(180deg,#ffffff,#dbeafe)",
        color: darkMode ? "white" : "#111827",
        boxShadow: darkMode
  ? "none"
  : "0 8px 20px rgba(0,0,0,0.08)",
      }}
      
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          background: darkMode
            ? "#1f2937"
            : "white",
        }}
      >
        <div>
          <h1>🌍 WordWings</h1>
          <p>Learn languages interactively</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
          }}
        >
          <h3>🔥 {streak}</h3>
          <h3>⭐ {xp}</h3>
          <h3>❤️ {hearts}</h3>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            style={{
              border: "none",
              padding: "12px 18px",
              borderRadius: 12,
              cursor: "pointer",
              background: "#58cc02",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {darkMode ? "☀" : "🌙"}
          </button>
        </div>
      </div>

      {/* HERO */}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 30,
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#58cc02,#1cb0f6)",
            borderRadius: 35,
            padding: 40,
            marginBottom: 30,
            color: "white",
          }}
        >
          <h1 style={{ fontSize: 60 }}>
            Learn {selectedLanguage}
          </h1>

          <p style={{ fontSize: 22 }}>
            Practice vocabulary, speaking,
            listening and games.
          </p>
        </div>

        {/* LANGUAGE SELECT */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 18,
            marginBottom: 35,
          }}
        >
          {Object.keys(lessons).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setSelectedLanguage(lang);
                setQuestionIndex(0);
              }}
              style={{
                padding: 20,
                borderRadius: 22,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 18,
                background:
                  selectedLanguage === lang
                    ? "#58cc02"
                    : darkMode
                    ? "#1f2937"
                    : "white",
                color:
                  selectedLanguage === lang
                    ? "white"
                    : darkMode
                    ? "white"
                    : "black",
              }}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* MAIN GRID */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 25,
          }}
        >
          {/* LESSON CARD */}

          <div
            style={{
              background: darkMode
                ? "#1f2937"
                : "white",
              borderRadius: 30,
              padding: 35,
            }}
          >
            <h2>Lesson</h2>

            <div
              style={{
                background: darkMode
                  ? "#111827"
                  : "#f3f4f6",
                padding: 25,
                borderRadius: 24,
              }}
            >
              <h1 style={{ fontSize: 56 }}>
                {currentLesson.word}
              </h1>

              <PrimaryButton
                color="#1cb0f6"
                onClick={() =>
                  speak(currentLesson.word)
                }
              >
                🔊 Pronounce
              </PrimaryButton>

              <PrimaryButton
                color="#58cc02"
                onClick={() =>
                  speak(currentLesson.sentence)
                }
              >
                🎧 Sentence
              </PrimaryButton>
            </div>

            <h2 style={{ marginTop: 25 }}>
              {currentLesson.question}
            </h2>

            <Grid>
              {generateOptions().map(
                (option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleAnswer(option)
                    }
                    style={{
                      padding: 20,
                      borderRadius: 18,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 18,
                      fontWeight: "bold",
                      background:
                        selectedAnswer === option
                          ? option ===
                            currentLesson.correct
                            ? "#58cc02"
                            : "#ef4444"
                          : darkMode
                          ? "#111827"
                          : "#d1d5db",
                      color:
                        selectedAnswer === option
                          ? "white"
                          : darkMode
                          ? "white"
                          : "black",
                    }}
                  >
                    {option}
                  </button>
                )
              )}
            </Grid>

            <h2>{feedback}</h2>
          </div>

          {/* SIDEBAR */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 25,
            }}
          >
            <div
              style={{
                background: darkMode
                  ? "#1f2937"
                  : "white",
                borderRadius: 30,
                padding: 25,
              }}
            >
              <h2>Achievements</h2>

              <p>🏆 Beginner</p>
              <p>🔥 1 Day Streak</p>
              <p>⭐ XP Master</p>
            </div>

            <div
              style={{
                background:
                  "linear-gradient(135deg,#7c3aed,#1cb0f6)",
                borderRadius: 30,
                padding: 25,
                color: "white",
              }}
            >
              <h2>Mini Games</h2>

              <SidebarButton
                onClick={() => {
                  generateMemoryQuestion();
                  setFeedback("");
                  setActiveGame("memory");
                }}
              >
                🧠 Memory Match
              </SidebarButton>

              <SidebarButton
                onClick={() => {
                  setFeedback("");
                  setActiveGame("speed");
                }}
              >
                ⚡ Speed Challenge
              </SidebarButton>

              <SidebarButton
                onClick={() => {
                  generateListeningQuestion();
                  setFeedback("");
                  setActiveGame("listening");
                }}
              >
                🎧 Listening Game
              </SidebarButton>

              <SidebarButton
                onClick={() => {
                  setSpeakingResult("");
                  setActiveGame("speaking");
                }}
              >
                🎤 Speaking Practice
              </SidebarButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= REUSABLE COMPONENTS ========================= */

function GameWrapper({ children, darkMode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "#111827"
          : "#f3f4f6",
        color: darkMode ? "white" : "black",
        padding: 40,
      }}
    >
      {children}
    </div>
  );
}

function GameCard({ children, darkMode }) {
  return (
    <div
      style={{
        background: darkMode
          ? "#1f2937"
          : "white",
        borderRadius: 30,
        padding: 40,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

function BackButton({ setActiveGame }) {
  return (
    <button
      onClick={() => setActiveGame(null)}
      style={{
        border: "none",
        padding: "14px 22px",
        borderRadius: 16,
        cursor: "pointer",
        marginBottom: 30,
        fontWeight: "bold",
        background: "#58cc02",
        color: "white",
      }}
    >
      ← Back
    </button>
  );
}

function Grid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 15,
        marginTop: 20,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  color,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        padding: "16px 24px",
        borderRadius: 18,
        cursor: "pointer",
        background: color,
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        margin: 10,
      }}
    >
      {children}
    </button>
  );
}

function OptionButton({
  children,
  onClick,
  darkMode,
  selected,
  correct,
}) {
  let background = darkMode
    ? "#111827"
    : "#e5e7eb";

  let color = darkMode
    ? "white"
    : "black";

  if (selected) {
    background = correct
      ? "#58cc02"
      : "#ef4444";

    color = "white";
  }

  return (
    <button
      onClick={onClick}
      style={{
        padding: 18,
        borderRadius: 18,
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: 18,
        background,
        color,
        transition: "0.2s",
      }}
    >
      {children}
    </button>
  );
}

function SidebarButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        padding: "18px 20px",
        borderRadius: 20,
        cursor: "pointer",
        fontWeight: "bold",
        marginBottom: 16,
        fontSize: 18,
        background:
          "linear-gradient(135deg,#ffffff,#f3f4f6)",
        color: "#111827",
        boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.03)";
        e.target.style.background =
          "linear-gradient(135deg,#58cc02,#1cb0f6)";
        e.target.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.background =
          "linear-gradient(135deg,#ffffff,#f3f4f6)";
        e.target.style.color = "#111827";
      }}
    >
      {children}
    </button>
  );
}