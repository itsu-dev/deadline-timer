import './App.css'
import useTimer from "./hooks/useTimer.ts";
import {useState} from "react";

function App() {
    const {
        timeText,
        className,
        title,
        baseTime,
        setTitle,
        setBaseTime,
        clearSettings,
        showSettingsDescription,
        updateShowSettingsDescription,
    } = useTimer();
    const [revealSettings, setRevealSettings] = useState(false);

    const [inputTitle, setInputTitle] = useState('');
    const [inputDate, setInputDate] = useState('');

    const toggleSettings = () => {
        setInputTitle(title);

        const date = new Date(baseTime + 1000 * 60 * 60 * 9);
        setInputDate(date.toISOString().slice(0, 16));

        updateShowSettingsDescription();
        setRevealSettings(!revealSettings);
    }

    const saveSettings = () => {
        const date = new Date(inputDate);
        setBaseTime(date.getTime());
        setTitle(inputTitle);

        setRevealSettings(false);
    }

    const _clearSettings = () => {
        clearSettings();
        window.location.reload();
    }

    return (
        <main className={className}>
            <h1>{title}</h1>
            <a href={"#"} onClick={toggleSettings}>
                <time className={"time"}>{timeText}</time>
                <br/>{showSettingsDescription &&
                <span className={"settings-description"}>時間表示をクリックで設定を開きます（一度クリックするとこの表示は一生表示されません）</span>
            }
            </a>
            {revealSettings &&
                <section>
                    <h2>設定</h2>
                    <p>タイトル：<input type={"text"} placeholder={'卒論提出まで'} value={inputTitle}
                                       onChange={(e) => setInputTitle(e.target.value)}></input></p>
                    <p>期日：<input type={"datetime-local"} value={inputDate}
                                   onChange={(e) => setInputDate(e.target.value)}></input></p>
                    <button onClick={_clearSettings}>設定を初期化</button>
                    <button onClick={saveSettings}>保存</button>
                </section>
            }
        </main>
    )
}

export default App
