class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.isScientific = false;
        this.isRadians = true;
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '%':
                computation = (prev * current) / 100;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('de', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay},${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        currentOperandTextElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            previousOperandTextElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            previousOperandTextElement.textContent = '';
        }
    }

    // Neue wissenschaftliche Methoden
    sin(number) {
        return this.isRadians ? Math.sin(number) : Math.sin(number * Math.PI / 180);
    }

    cos(number) {
        return this.isRadians ? Math.cos(number) : Math.cos(number * Math.PI / 180);
    }

    tan(number) {
        return this.isRadians ? Math.tan(number) : Math.tan(number * Math.PI / 180);
    }

    sqrt(number) {
        return Math.sqrt(number);
    }

    log(number) {
        return Math.log10(number);
    }

    ln(number) {
        return Math.log(number);
    }

    exp(number) {
        return Math.exp(number);
    }

    pow(base, exponent) {
        return Math.pow(base, exponent);
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    abs(number) {
        return Math.abs(number);
    }

    inv(number) {
        return 1 / number;
    }

    executeScientificOperation(operation) {
        const current = parseFloat(this.currentOperand);
        
        switch(operation) {
            case 'sin':
                this.currentOperand = this.sin(current);
                break;
            case 'cos':
                this.currentOperand = this.cos(current);
                break;
            case 'tan':
                this.currentOperand = this.tan(current);
                break;
            case 'sqrt':
                this.currentOperand = this.sqrt(current);
                break;
            case 'log':
                this.currentOperand = this.log(current);
                break;
            case 'ln':
                this.currentOperand = this.ln(current);
                break;
            case 'exp':
                this.currentOperand = this.exp(current);
                break;
            case 'abs':
                this.currentOperand = this.abs(current);
                break;
            case 'factorial':
                this.currentOperand = this.factorial(current);
                break;
            case 'inv':
                this.currentOperand = this.inv(current);
                break;
            case 'pi':
                this.currentOperand = Math.PI;
                break;
            case 'e':
                this.currentOperand = Math.E;
                break;
            case 'rad':
                this.isRadians = !this.isRadians;
                return;
        }
        
        this.operation = undefined;
        this.previousOperand = '';
    }
}

// Blasen-Animation
function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = Math.random() * 60 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.setProperty('--random-start', `${Math.random() * 100}%`);
    
    document.querySelector('.bubble-background').appendChild(bubble);
    
    bubble.addEventListener('animationend', () => {
        bubble.remove();
    });
}

// Blasen periodisch erstellen
setInterval(createBubble, 300);

// DOM Elemente
const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operator');
const specialButtons = document.querySelectorAll('.special');
const previousOperandTextElement = document.querySelector('.previous-operand');
const currentOperandTextElement = document.querySelector('.current-operand');

const calculator = new Calculator();

// Event Listeners für Zahlen
numberButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        calculator.appendNumber(button.querySelector('span').innerText);
        calculator.updateDisplay();
        createRippleEffect(button, event.clientX, event.clientY);
    });
});

// Event Listeners für Operatoren
operationButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (button.dataset.action === 'equals') {
            calculator.compute();
        } else {
            calculator.chooseOperation(button.querySelector('span').innerText);
        }
        calculator.updateDisplay();
        createRippleEffect(button, event.clientX, event.clientY);
    });
});

// Event Listeners für spezielle Funktionen
specialButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        switch (button.dataset.action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'percent':
                calculator.chooseOperation('%');
                break;
        }
        calculator.updateDisplay();
        createRippleEffect(button, event.clientX, event.clientY);
    });
});

// Tastatur-Support
document.addEventListener('keydown', e => {
    let button;
    
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        button = Array.from(numberButtons).find(btn => btn.querySelector('span').innerText === e.key);
        if (button) {
            calculator.appendNumber(e.key);
            createRippleEffect(button);
        }
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const operationMap = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        button = Array.from(operationButtons).find(btn => btn.querySelector('span').innerText === operationMap[e.key]);
        if (button) {
            calculator.chooseOperation(operationMap[e.key]);
            createRippleEffect(button);
        }
    } else if (e.key === 'Enter' || e.key === '=') {
        button = Array.from(operationButtons).find(btn => btn.dataset.action === 'equals');
        if (button) {
            calculator.compute();
            createRippleEffect(button);
        }
    } else if (e.key === 'Backspace') {
        button = Array.from(specialButtons).find(btn => btn.dataset.action === 'delete');
        if (button) {
            calculator.delete();
            createRippleEffect(button);
        }
    } else if (e.key === 'Escape') {
        button = Array.from(specialButtons).find(btn => btn.dataset.action === 'clear');
        if (button) {
            calculator.clear();
            createRippleEffect(button);
        }
    }
    calculator.updateDisplay();
});

// Ripple-Effekt für Buttons
function createRippleEffect(button, clientX, clientY) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    button.appendChild(ripple);

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // Wenn keine Mauskoordinaten vorhanden sind (Tastatureingabe),
    // setze den Effekt in die Mitte des Buttons
    const left = clientX ? clientX - rect.left - size/2 : rect.width/2 - size/2;
    const top = clientY ? clientY - rect.top - size/2 : rect.height/2 - size/2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${left}px`;
    ripple.style.top = `${top}px`;

    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// UI Controls
const settingsBtn = document.querySelector('.settings-btn');
const settingsBackBtn = document.querySelector('.settings-back-btn');
const settingsPanel = document.querySelector('.settings-panel');
const modeToggleBtn = document.querySelector('.mode-btn');
const calculatorContainer = document.querySelector('.calculator-container');
const themeBtns = document.querySelectorAll('.theme-btn');

// Settings Panel Toggle
function toggleSettings() {
    settingsPanel.classList.toggle('active');
}

settingsBtn.addEventListener('click', toggleSettings);
settingsBackBtn.addEventListener('click', toggleSettings);

// Theme Switching
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.body.className = `${theme}-theme`;
        
        // Aktiven Button markieren
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Scientific Mode Toggle mit verbesserter Animation
modeToggleBtn.addEventListener('click', () => {
    calculatorContainer.classList.toggle('scientific-mode');
    modeToggleBtn.classList.toggle('active');
    calculator.isScientific = !calculator.isScientific;
});

// Klick außerhalb des Settings-Panels schließt es
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && 
        !settingsBtn.contains(e.target) && 
        settingsPanel.classList.contains('active')) {
        settingsPanel.classList.remove('active');
        settingsBtn.classList.remove('active');
    }
});

// Scientific Button Event Listeners
const scientificButtons = document.querySelectorAll('.scientific');
scientificButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        calculator.executeScientificOperation(button.dataset.action);
        calculator.updateDisplay();
        createRippleEffect(button, event.clientX, event.clientY);
    });
});

// Developer Settings
const devToggle = document.querySelector('.dev-toggle');
const devOptions = document.querySelector('.dev-options');
const bgImageInput = document.getElementById('bgImage');
const ytVideoInput = document.getElementById('ytVideo');
const blurStrength = document.getElementById('blurStrength');
const opacityInput = document.getElementById('opacity');
const animSpeedInput = document.getElementById('animSpeed');
const debugMode = document.getElementById('debugMode');
const devReset = document.querySelector('.dev-reset');

// Background Container hinzufügen
const backgroundContainer = document.createElement('div');
backgroundContainer.className = 'background-container';
document.body.insertBefore(backgroundContainer, document.body.firstChild);

// Dev Options Toggle
devToggle.addEventListener('click', () => {
    devOptions.classList.toggle('active');
    devToggle.querySelector('.material-icons').textContent = 
        devOptions.classList.contains('active') ? 'code_off' : 'code';
});

// Hintergrundbild-Upload
bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setBackground('image', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// YouTube Video
ytVideoInput.addEventListener('input', debounce((e) => {
    const videoId = e.target.value;
    if (videoId) {
        setBackground('video', videoId);
    }
}, 500));

// Blur Strength
blurStrength.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--blur-strength', `${e.target.value}px`);
    updateCalculatorStyle();
});

// Opacity
opacityInput.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--panel-opacity', e.target.value / 100);
    updateCalculatorStyle();
});

// Animation Speed
animSpeedInput.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--animation-speed', e.target.value);
    updateAnimationSpeeds();
});

// Debug Mode
debugMode.addEventListener('change', (e) => {
    document.body.classList.toggle('debug-mode', e.target.checked);
});

// Reset Button
devReset.addEventListener('click', () => {
    resetDevSettings();
});

// Hilfsfunktionen
function setBackground(type, source) {
    backgroundContainer.innerHTML = '';
    
    if (type === 'image') {
        const img = document.createElement('img');
        img.className = 'background-image';
        img.src = source;
        backgroundContainer.appendChild(img);
    } else if (type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.className = 'background-video';
        iframe.src = `https://www.youtube.com/embed/${source}?autoplay=1&mute=1&controls=0&loop=1&playlist=${source}`;
        iframe.allow = 'autoplay; encrypted-media';
        iframe.frameBorder = '0';
        backgroundContainer.appendChild(iframe);
    }
}

function updateCalculatorStyle() {
    const blur = blurStrength.value;
    const opacity = opacityInput.value / 100;
    document.documentElement.style.setProperty('--calculator-blur', `${blur}px`);
    document.documentElement.style.setProperty('--calculator-opacity', opacity);
}

function updateAnimationSpeeds() {
    const speed = animSpeedInput.value;
    document.documentElement.style.setProperty('--animation-duration', `${3 / speed}s`);
}

function resetDevSettings() {
    backgroundContainer.innerHTML = '';
    blurStrength.value = 25;
    opacityInput.value = 74;
    animSpeedInput.value = 1;
    debugMode.checked = false;
    ytVideoInput.value = '';
    document.body.classList.remove('debug-mode');
    updateCalculatorStyle();
    updateAnimationSpeeds();
}

// Debounce Funktion
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Glow Controls
const glowMode = document.getElementById('glowMode');
const glowColor = document.getElementById('glowColor');
const glowSpeed = document.getElementById('glowSpeed');
const glowIntensity = document.getElementById('glowIntensity');

// Update Slider Track
function updateSliderTrack(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.setProperty('--value', `${value}%`);
}

// Update Glow Effect
function updateGlowEffect() {
    const mode = glowMode.value;
    const color = glowColor.value;
    const speed = glowSpeed.value;
    const intensity = glowIntensity.value / 100;
    
    const container = document.querySelector('.calculator-container');
    
    // Entferne alle vorherigen Glow-Klassen
    container.classList.remove('glow-static', 'glow-breathe', 'glow-wave', 'glow-rainbow', 'glow-pulse', 'glow-off');
    
    // Setze die CSS-Variablen
    document.documentElement.style.setProperty('--glow-color-1', color);
    document.documentElement.style.setProperty('--glow-color-2', adjustColor(color, -20));
    
    // Füge die neue Klasse hinzu
    container.classList.add(`glow-${mode}`);
    
    // Setze die Animationsgeschwindigkeit
    if (mode !== 'static' && mode !== 'off') {
        container.style.animationDuration = `${speed}ms`;
    }
    
    // Setze die Intensität
    const glowStrength = intensity * 100;
    document.documentElement.style.setProperty('--glow-intensity', intensity);
    document.documentElement.style.setProperty('--glow-strength', `${glowStrength}%`);
}

// Hilfsfunktion zum Anpassen der Farbe
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Event Listeners
glowMode.addEventListener('change', updateGlowEffect);
glowColor.addEventListener('input', updateGlowEffect);

glowSpeed.addEventListener('input', () => {
    const value = glowSpeed.value;
    glowSpeed.nextElementSibling.textContent = `${value}ms`;
    updateSliderTrack(glowSpeed);
    updateGlowEffect();
});

glowIntensity.addEventListener('input', () => {
    const value = glowIntensity.value;
    glowIntensity.nextElementSibling.textContent = `${value}%`;
    updateSliderTrack(glowIntensity);
    updateGlowEffect();
});

// Initial Updates
[glowSpeed, glowIntensity].forEach(slider => {
    updateSliderTrack(slider);
});
updateGlowEffect(); 