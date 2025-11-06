import { createContext, useState } from "react";
import Main from "./components/Mmain/Main";
import Sidebar from "./components/Sidebar/Sidebar";
const userContex = createContext();

function App() {
  const [previousPrompt, setPreciousPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false)
  const [question, setQuestion] = useState("")

  return (
    <>
      <userContex.Provider value={{ previousPrompt, setPreciousPrompt, showResult, setShowResult, question, setQuestion}}>
        <Sidebar />
        <Main />
      </userContex.Provider>
    </>
  );
}

export default App;
export { userContex }