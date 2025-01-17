import {useEffect, useRef, useState} from "react";

export default function useTimer() {

    const [title, setTitle] = useState('卒論提出まで');
    const [timeText, setTimeText] = useState('');
    const [showSettingsDescription, setShowSettingsDescription] = useState(true);

    // 2025/2/3 17:00:00 JST
    const baseTime = useRef(1738569600000);

    const [className, setClassName] = useState('default');

    const frameId = useRef(0);

    const pad = (num: number, length: number) => {
        return (Array(length).join('0') + num).slice(-length);
    }

    const updateTimer = () => {
        const now = Date.now();
        const diff = baseTime.current - now;

        if (diff <= 0) {
            setClassName('expired');
            setTimeText('0日0時間0分0秒000');
            return;
        }

        const day = diff / (1000 * 60 * 60 * 24);
        const hour = (day - Math.floor(day)) * 24;
        const minute = (hour - Math.floor(hour)) * 60;
        const second = (minute - Math.floor(minute)) * 60;
        const msec = (second - Math.floor(second)) * 1000;

        setTimeText(`${Math.floor(day)}日${Math.floor(hour)}時間${Math.floor(minute)}分${Math.floor(second)}秒${pad(msec, 3)}`);

        if (day < 1) {
            setClassName('alert');
        } else if (day < 3) {
            setClassName('danger');
        } else if (day < 10) {
            setClassName('warning');
        } else {
            setClassName('default');
        }

        frameId.current = requestAnimationFrame(updateTimer);
    }

    const _setBaseTime = (time: number) => {
        baseTime.current = time;
        localStorage.setItem('baseTime', time.toString());
    }

    const _setTitle = (title: string) => {
        setTitle(title);
        localStorage.setItem('title', title);
    }

    const updateShowSettingsDescription = () => {
        localStorage.setItem('showSettingsDescription', '1');
        setShowSettingsDescription(false);
    }

    const clearSettings = () => {
        localStorage.removeItem('title');
        localStorage.removeItem('baseTime');
        localStorage.removeItem('showSettingsDescription');
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const t = searchParams.get('t');
        if (t) {
            setTitle(t);
        } else {
            const savedTitle = localStorage.getItem('title');
            if (savedTitle) {
                setTitle(savedTitle);
            }
        }

        const b = searchParams.get('b');
        if (b) {
            baseTime.current = parseInt(b);
        } else {
            const savedBaseTime = localStorage.getItem('baseTime');
            if (savedBaseTime) {
                baseTime.current = parseInt(savedBaseTime);
            }
        }

        setShowSettingsDescription(localStorage.getItem('showSettingsDescription') !== '1');

        frameId.current = requestAnimationFrame(updateTimer);

        return () => {
            cancelAnimationFrame(frameId.current);
        }
    }, []);

    return {
        timeText,
        baseTime: baseTime.current,
        className,
        title,
        setTitle: _setTitle,
        setBaseTime: _setBaseTime,
        showSettingsDescription,
        updateShowSettingsDescription,
        clearSettings,
    };
}