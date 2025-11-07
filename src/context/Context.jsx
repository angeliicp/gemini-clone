import { createContext } from "react";
import main from "../config/gemini";
import { useState } from "react";

// buat Context kosong
export const Context = createContext();

// buat komponen provider (pembungkus) yang akan menyediakan nilai Context. contextValue adl data yang bakal dibagikan ke komponen yang butuh
const ContextProvider = (props) => {
    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState([])

    // state untuk menampilkan hasil response dari gemini
    const [showResult, setShowResult] = useState(false)

    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")

    // fungsi untuk menampilkan effect typing
    const delayPara = (index,nextWord) => {
        setTimeout(function() {
            setResultData( (prev) => prev + nextWord )
        }, 75*index )
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        // set result data to be empty first
        setResultData("")

        setLoading(true)
        setShowResult(true)
        
        let response
        if (prompt !== undefined) {
            response = await main(prompt)
            setRecentPrompt(prompt)
        } else {
            setPrevPrompts(prev => [...prev, input])
            setRecentPrompt(input)
            response = await main(input)
        }

        // setRecentPrompt(input)

        // // simpan prompt ke riwayat
        // setPrevPrompts(prev => [...prev, input])

        // // response nya dari gemini.js
        // const response =await main(input)

        // ini yg ril hrusnya ya
        // ini buat ngeformat bold text yg diapit **text**
        // let resArr = response.split("**")
        // let newRes = ""
        // for (let i = 0; i < resArr.length; i++) {
        //     if(i===0 || i%2 !== 1){
        //         newRes += resArr[i]
        //     } else {
        //         newRes += "<b>" + resArr[i] + "</b>"
        //     }
        // }

        // // ini buat nambah effect typing, jd ai generated textnya ga langsung muncul semua
        // let newRes2 = newRes.split("*").join("</br>")

        // let newRespArr = newRes2.split(" ")
        // for (let i = 0; i < newRespArr.length; i++) {
        //     const nextWord = newRespArr[i]
        //     delayPara(i, nextWord + " ")
        // }

        let newRespArr = response.split(" ")
        for (let i = 0; i < newRespArr.length; i++) {
            const nextWord = newRespArr[i]
            delayPara(i, nextWord + " ")
        }



        setLoading(false)
        setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    // Context.Provider adl penyedia data, Semua komponen di dalam {props.children} bisa mengakses contextValue pakai useContext(Context)
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;