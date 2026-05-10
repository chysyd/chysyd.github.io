// 语音朗读功能 - 适用于 chysyd.github.io 所有对话页面
(function() {
    function initReadAloud() {
        const readBtn = document.getElementById('readAloudBtn');
        const stopBtn = document.getElementById('stopBtn');
        if (!readBtn || !stopBtn) return;

        let utterance = null;
        let currentIndex = 0;
        let exchanges = [];

        function collectExchanges() {
            const exchangeDivs = document.querySelectorAll('.exchange');
            const items = [];
            exchangeDivs.forEach(div => {
                const speakerDiv = div.querySelector('.speaker');
                const messageDiv = div.querySelector('.message');
                if (!speakerDiv || !messageDiv) return;
                let speakerName = '';
                if (speakerDiv.classList.contains('user')) speakerName = '我说';
                else if (speakerDiv.classList.contains('deepseek')) speakerName = 'DeepSeek';
                else if (speakerDiv.classList.contains('claude')) speakerName = 'Claude';
                else if (speakerDiv.classList.contains('gemini')) speakerName = 'Gemini';
                else if (speakerDiv.classList.contains('grok')) speakerName = 'Grok';
                else if (speakerDiv.classList.contains('doubao')) speakerName = '豆包';
                else if (speakerDiv.classList.contains('chatgpt')) speakerName = 'ChatGPT';
                else speakerName = speakerDiv.innerText.trim().replace(/[🤖👤]/g, '').trim();
                const text = messageDiv.innerText.trim();
                if (text) items.push({ speaker: speakerName, content: text });
            });
            return items;
        }

        function speakNext() {
            if (currentIndex >= exchanges.length) {
                utterance = null;
                return;
            }
            const item = exchanges[currentIndex];
            const fullText = `${item.speaker}：${item.content}`;
            utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.9;
            utterance.onend = function() {
                currentIndex++;
                speakNext();
            };
            utterance.onerror = function() {
                currentIndex++;
                speakNext();
            };
            window.speechSynthesis.speak(utterance);
        }

        readBtn.addEventListener('click', () => {
            if (utterance) window.speechSynthesis.cancel();
            exchanges = collectExchanges();
            if (exchanges.length === 0) {
                alert('没有找到可朗读的对话内容');
                return;
            }
            currentIndex = 0;
            speakNext();
        });

        stopBtn.addEventListener('click', () => {
            if (utterance) {
                window.speechSynthesis.cancel();
                utterance = null;
                currentIndex = 0;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReadAloud);
    } else {
        initReadAloud();
    }
})();
