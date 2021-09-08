interface Configurations {
  type: "bar" | "fullpage";
  background: string;
  height: number;
  svg?: string;
}

const defaultValues: Configurations = {
  type: "bar",
  background: "#aaaaaa",
  height: 5,
};

const defaultSVG = `
<svg width="150px" height="50px" version="1.1" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(115,-245)">
<text transform="scale(.86637 1.1542)" x="18.282198" y="245.38565" style="font-family:sans-serif;font-size:29.982px;letter-spacing:0px;line-height:1.25;stroke-width:.74956;word-spacing:0px" xml:space="preserve"><tspan x="18.282198" y="245.38565" style="stroke-width:.74956">Your SVG</tspan></text>
 </g>
</svg>
`;

class Progress {
  private type: Configurations["type"];
  private background: Configurations["background"];
  private height: Configurations["height"];
  private from = 0.1;
  private to = 1;
  private timer: number | null = null;
  private svg?: Configurations["svg"];

  constructor(initials: Configurations) {
    this.type = initials.type;
    this.background = initials.background;
    this.height = initials.height;
  }

  private get body() {
    return document.getElementsByTagName("body");
  }
  private get bar() {
    return document.getElementById("progress__bar");
  }
  private get fullpage() {
    return document.getElementById("progress__fullpage");
  }
  start() {
    this._unsubscribe();
    if (this.type === "fullpage") {
      this._startFullpage();
    } else if (this.type === "bar") {
      this._startBar();
    }
  }
  complete() {
    this._unsubscribe();
    if (this.type === "bar") {
      const bar = this.bar;
      if (bar) {
        bar.style.width = "100%";
        bar.style.opacity = "0";
      }
    } else if (this.type === "fullpage") {
      const modal = this.fullpage;
      if (modal) {
        modal.remove();
      }
    }
  }

  configure(configs: Partial<Configurations>) {
    this.type = configs.type || defaultValues.type;
    this.background = configs.background || defaultValues.background;
    this.height = configs.height || defaultValues.height;
    this.svg = configs.svg || defaultSVG;
  }

  /**
   * Inners
   */
  private _startFullpage() {
    const body = this.body;
    if (!body[0]) return;

    const html = `
    <div id="progress__fullpage" role="none presentation" tabindex="-1">
      <style>
        #progress__fullpage {
          position: fixed;
          width: 100%;
          height: 100%;
          z-index: 9000;
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
        .progress__fullpage__inner{
          padding: 1rem;
          background: #ffffff;
          color:#a9a9a9;
          border-radius: 5px;
          min-width: 100px;
        }
        .progress__fullpage__inner_skeleton svg{
          fill: url(#progress__fullpage__inner_skeleton);
        }
      </style>
      <div class="progress__fullpage__inner">
        <div class="progress__fullpage__inner_skeleton">
          ${this.svg}
        </div>
      </div>
    </div>
    `;
    let modal = this.fullpage;
    if (modal) {
      modal.remove();
    }
    body[0].insertAdjacentHTML("afterbegin", html);
    const newModal = this.fullpage as HTMLElement;
    const svg = document.querySelector(
      ".progress__fullpage__inner_skeleton svg"
    );
    svg?.insertAdjacentHTML(
      "afterbegin",
      `<defs>
      <linearGradient id="progress__fullpage__inner_skeleton">
        <stop offset="0%" stop-color="#a9a9a9" />
        <stop offset="15%" stop-color="#a9a9a9" />
        <stop offset="50%" stop-color="#dbdbdb" />
        <stop offset="85%" stop-color="#a9a9a9" />
        <stop offset="100%" stop-color="#a9a9a9" />
        <animateTransform attributeName="gradientTransform"
          type="translate"
          from="-1 0"
          to="1 0"
          begin="0s"
          dur="1.5s"
          repeatCount="indefinite"/>
      </linearGradient>
    </defs>`
    );
    newModal.style.background = this.background;
    this.timer = setTimeout(() => {
      newModal.style.opacity = "1";
    }, 1);
  }
  private _startBar() {
    const body = this.body;
    if (!body[0]) return;

    const html = `
    <div id="progress__bar">
    <style>
      #progress__bar {
        position: fixed;
        width: 0;
        opacity:0;
        top:0;
        left:0;
        z-index: 9000;
        transition: all 500ms ease-in-out;
        border-radius: 0 2px 2px 0;
        box-shadow: 0 1px 3px #696969;
      }
    </style>
    </div>
    `;

    let bar = this.bar;
    if (bar) {
      bar.remove();
    }
    body[0].insertAdjacentHTML("afterbegin", html);
    const newBar = this.bar as HTMLElement;
    this.from = 0;
    newBar.style.width = this.from * 100 + "%";
    newBar.style.opacity = "1";
    newBar.style.height = this.height + "px";
    newBar.style.background = this.background;

    this.timer = setInterval(() => this._increment(), 200);
  }
  private _increment() {
    let incrementer = 0.2;
    if (this.to - this.from >= 0.65) {
      incrementer = 0.06;
    } else if (this.to - this.from >= 0.3) {
      incrementer = 0.02;
    } else if (this.to - this.from >= 0) {
      incrementer = 0.01;
    } else {
      return this._unsubscribe();
    }
    const bar = this.bar;
    if (bar) {
      this.from += incrementer;
      bar.style.width = this.from * 99 + "%";
    }
  }

  private _unsubscribe() {
    if (this.timer) {
      clearTimeout(this.timer);
      clearInterval(this.timer);
    }
  }
}

export default new Progress(defaultValues);
