/* Original, dependency-free enhancements. Each experiment can fail independently. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const showMotionPreference = () => {
    document.querySelector('#motion-preference').textContent = reducedMotion.matches
      ? '系统已要求减少动态效果' : '动态效果跟随系统设置';
  };
  showMotionPreference();
  reducedMotion.addEventListener('change', showMotionPreference);

  function enhance(id, setup) {
    const root = document.getElementById(id);
    try {
      setup(root);
      root.dataset.enhanced = 'true';
      root.querySelectorAll('.js-note').forEach(note => { note.hidden = true; });
    } catch (error) {
      // Preserve the other independent examples if one enhancement cannot initialize.
      console.warn(`Interaction example ${id} remained in its available fallback state.`, error);
    }
  }

  enhance('preview-example', root => {
    const buttons = [...root.querySelectorAll('[data-project]')];
    const figures = [...root.querySelectorAll('.preview-figure')];
    function select(button) {
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      figures.forEach(figure => { figure.hidden = figure.id !== button.dataset.project; });
    }
    buttons.forEach(button => {
      button.disabled = false;
      button.setAttribute('aria-controls', button.dataset.project);
      button.addEventListener('focus', () => select(button));
      button.addEventListener('click', () => select(button));
      button.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') select(button);
      });
    });
    select(buttons[0]);
  });

  enhance('segment-example', root => {
    const list = root.querySelector('.segment-list');
    const tabs = [...root.querySelectorAll('.segment')];
    const panels = [...root.querySelectorAll('.segment-panel')];
    const indicator = root.querySelector('.segment-indicator');
    let selected = tabs[0];
    function positionIndicator() {
      indicator.style.width = `${selected.offsetWidth}px`;
      indicator.style.transform = `translateX(${selected.offsetLeft}px)`;
    }
    function select(tab, moveFocus = false) {
      selected = tab;
      tabs.forEach(item => {
        item.setAttribute('aria-selected', String(item === tab));
        item.tabIndex = item === tab ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel.id !== tab.dataset.panel; });
      positionIndicator();
      if (moveFocus) tab.focus({ preventScroll: true });
    }
    list.setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', tab.dataset.panel);
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
        event.preventDefault();
        select(tab);
      });
      tab.addEventListener('keydown', event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const direction = getComputedStyle(list).direction === 'rtl' ? -1 : 1;
        let next;
        if (event.key === 'ArrowRight') next = (index + direction + tabs.length) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - direction + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (event.key === ' ') next = index;
        if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
      });
    });
    function selectFromAddress() {
      const linkedTab = tabs.find(tab => `#${tab.dataset.panel}` === location.hash);
      if (linkedTab) select(linkedTab);
    }
    indicator.hidden = false;
    select(tabs.find(tab => `#${tab.dataset.panel}` === location.hash) || tabs[0]);
    window.addEventListener('hashchange', selectFromAddress);
    if ('ResizeObserver' in window) new ResizeObserver(positionIndicator).observe(list);
    else window.addEventListener('resize', positionIndicator);
  });

  // details/summary handles opening, closing and keyboard behavior without scripting.
  enhance('disclosure-example', () => {});

  enhance('submit-example', root => {
    const button = root.querySelector('#submit-demo');
    const label = root.querySelector('.submit-label');
    const symbol = root.querySelector('.status-symbol');
    const status = root.querySelector('#submit-status');
    const options = root.querySelector('#outcome-options');
    button.disabled = false;
    button.setAttribute('aria-disabled', 'false');
    button.addEventListener('click', () => {
      if (root.dataset.state === 'pending') return;
      const outcome = root.querySelector('input[name="outcome"]:checked').value;
      root.dataset.state = 'pending';
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('aria-busy', 'true');
      options.disabled = true;
      label.textContent = '处理中';
      symbol.textContent = '◌';
      status.textContent = '本地模拟处理中。请稍候，没有真实网络请求。';
      // Fixed delay exists only to make this explicitly labeled demonstration observable.
      window.setTimeout(() => {
        const success = outcome === 'success';
        root.dataset.state = success ? 'success' : 'error';
        button.setAttribute('aria-disabled', 'false');
        button.removeAttribute('aria-busy');
        options.disabled = false;
        label.textContent = success ? '再次演示' : '重试演示';
        symbol.textContent = success ? '✓' : '↻';
        status.textContent = success
          ? '演示完成。没有保存任何文件，可以更换结果后再试一次。'
          : '演示未完成：模拟了失败结果。可以重试，也可以先把结果改为“完成”。';
      }, 900);
    });
  });

  enhance('undo-example', root => {
    const items = [...root.querySelectorAll('[data-item]')];
    const undo = root.querySelector('#undo-button');
    const status = root.querySelector('#undo-status');
    const empty = root.querySelector('#list-empty');
    const history = [];
    function update(message) {
      const visible = items.filter(item => !item.hidden);
      empty.hidden = visible.length > 0;
      undo.hidden = history.length === 0;
      if (history.length) undo.textContent = `撤销隐藏“${history[history.length - 1].dataset.label}”`;
      status.textContent = `${message} 当前 ${visible.length} / ${items.length} 项可见。`;
    }
    items.forEach((item, index) => {
      const button = item.querySelector('button');
      button.hidden = false;
      button.addEventListener('click', () => {
        item.hidden = true;
        history.push(item);
        update(`已隐藏“${item.dataset.label}”。`);
        const next = items.slice(index + 1).find(candidate => !candidate.hidden)
          || items.slice(0, index).reverse().find(candidate => !candidate.hidden);
        (next ? next.querySelector('button') : undo).focus({ preventScroll: true });
      });
    });
    undo.addEventListener('click', () => {
      const item = history.pop();
      if (!item) return;
      item.hidden = false;
      item.querySelector('button').focus({ preventScroll: true });
      update(`已恢复“${item.dataset.label}”。`);
    });
  });

  enhance('reading-example', root => {
    const reader = root.querySelector('#reader');
    const progress = root.querySelector('#reading-progress');
    const value = root.querySelector('#reading-value');
    const links = [...root.querySelectorAll('#chapter-nav a')];
    const headings = links.map(link => root.querySelector(link.hash));
    let frame = null;
    const topOf = heading => heading.getBoundingClientRect().top - reader.getBoundingClientRect().top + reader.scrollTop;
    function update() {
      frame = null;
      const range = reader.scrollHeight - reader.clientHeight;
      const percentage = range <= 0 ? 100 : Math.round(Math.min(1, Math.max(0, reader.scrollTop / range)) * 100);
      progress.value = percentage;
      value.textContent = `${percentage}% 已浏览`;
      let current = 0;
      headings.forEach((heading, index) => { if (topOf(heading) <= reader.scrollTop + 100) current = index; });
      if (percentage === 100) current = headings.length - 1;
      links.forEach((link, index) => {
        if (index === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function requestUpdate() { if (frame === null) frame = requestAnimationFrame(update); }
    links.forEach((link, index) => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      const heading = headings[index];
      const target = topOf(heading) - 24;
      heading.focus({ preventScroll: true });
      reader.scrollTo({ top: target, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }));
    reader.addEventListener('scroll', requestUpdate, { passive: true });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(requestUpdate);
      observer.observe(reader);
      observer.observe(reader.querySelector('article'));
    } else window.addEventListener('resize', requestUpdate);
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) reader.scrollTo({ top: reader.scrollTop, behavior: 'instant' });
    });
    progress.hidden = false;
    update();
  });
})();
