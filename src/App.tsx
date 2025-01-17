import './App.css'
import useTimer from "./hooks/useTimer.ts";
import {useEffect, useState} from "react";

type Timer = {
    title: string,
    base_time: number,
}

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
    const [timers, setTimers] = useState([] as Timer[]);

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

    const copyShareLink = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('t', inputTitle);
        url.searchParams.set('b', new Date(inputDate).getTime().toString());
        void navigator.clipboard.writeText(url.toString());

        alert(`共有リンクをコピーしました: ${url.toString()}`);
    }

    const _clearSettings = () => {
        clearSettings();
        window.location.reload();
    }

    const upload = () => {
        const result = confirm('このタイマーを公開しますか？');
        if (!result) {
            return;
        }

        (async () => {
            const res = await fetch('https://deadline-timer-bg.itsu020402.workers.dev/api/timers/post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: inputTitle,
                    baseTime: new Date(inputDate).getTime(),
                }),
            });

            if (res.ok) {
                alert('公開しました');
                setTimers([{
                    title: inputTitle,
                    base_time: new Date(inputDate).getTime(),
                }, ...timers]);
            } else {
                alert('公開に失敗しました');
            }
        })();
    }

    useEffect(() => {
        (async () => {
            const res = await fetch('https://deadline-timer-bg.itsu020402.workers.dev/api/timers');
            const data = await res.json();
            setTimers(data);
        })();
    }, []);

    return (
        <main className={className}>
            <h1>{title}</h1>
            <a href={"#"} onClick={toggleSettings}>
                <time className={"time"}>{timeText}</time>
                {showSettingsDescription &&
                    <>
                        <br/>
                        <span
                        className={"settings-description"}>時間表示をクリックでメニューを開きます（一度クリックするとこの表示は一生表示されません）</span>
                    </>
                }
            </a>
            {revealSettings &&
                <section className={"tools"}>
                    <section>
                        <h2>設定</h2>
                        <p>タイトル：<input type={"text"} placeholder={'卒論提出まで'} value={inputTitle}
                                           onChange={(e) => setInputTitle(e.target.value)}></input></p>
                        <p>期日：<input type={"datetime-local"} value={inputDate}
                                       onChange={(e) => setInputDate(e.target.value)}></input></p>
                        <button onClick={_clearSettings}>設定を初期化</button>
                        <button onClick={copyShareLink}>共有リンクをコピー</button>
                        <button onClick={upload}>公開</button>
                        <button onClick={saveSettings}>保存</button>
                    </section>
                    <section>
                        <h2>みんなのタイマー</h2>
                        <ul>
                            {timers.map((timer, i) => (
                                <li key={i}>
                                    <a href={`?t=${timer.title}&b=${timer.base_time}`} className={"timer"}>{timer.title}</a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </section>
            }
        </main>
    )
}

export default App
