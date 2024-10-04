/**
 * @param {TemplateStringsArray} s
 * @param {...(unknown)} values
 */
const cssToObj = (s, ...values) =>
  s
    .reduce((acc, str, i) => acc + str + (values[i] || ''), '')
    .split(';')
    .filter((x) => x)
    .reduce(
      (acc, x) => {
        const [key, value] = x.split(':');
        if (!key || !value) return acc;
        const camelCaseKey = key.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        acc[camelCaseKey] = value.trim();
        return acc;
      },
      /** @type Record<string, string> */ ({})
    );

export const Folder = () => (
  <div style={cssToObj`display: flex; flex: 1 0 1rem; max-width: 1rem;`}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <title>Folder</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
      />
    </svg>
  </div>
);

export const Document = () => (
  <div style={cssToObj`display: flex; flex: 1 0 1rem; max-width: 1rem; margin-top: 2px;`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ margin: -1 }}>
      <title>Document</title>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-5 14H7v-2h7zm3-4H7v-2h10zm0-4H7V7h10z" />
    </svg>
  </div>
);

// https://github.com/n3r4zzurr0/svg-spinners/blob/main/svg-css/90-ring-with-bg.svg
const style = /* css */ `.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}`;
export const Spinner = () => (
  <span style={{ color: ' #646cff' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}>
      <title>Spinner</title>
      <style>{style}</style>
      <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        className="spinner_ajPY"
      />
    </svg>
  </span>
);

export const Pencil = () => (
  <div style={cssToObj`color:#646cff; width: 1.2rem; height: 1.2rem;`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <title>Pencil</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  </div>
);
