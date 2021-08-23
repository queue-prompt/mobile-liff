import assign from 'nano-assign'
// import './style.css'

export default {
  name: 'StepIndicator',
  functional: true,
  props: {
    total: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    currentColor: {
      type: String,
      default: 'rgb(68, 0, 204)'
    },
    defaultColor: {
      type: String,
      default: 'rgb(130, 140, 153)'
    },
    handleClick: {
      type: Function
    }
  },
  render(h, { props, data }) {
    const steps = []
    for (let i = 0; i < props.total; i++) {
      const color = i === props.current ? props.currentColor : props.defaultColor
      const isPass = i < props.current
      let data = null;

      if (isPass) {
        // data = h('i', {
        //   class: "bi bi-check fs-4 ",
        //   style: { color: props.currentColor, borderColor: color }
        // })

        data = h('img', {
          class: "bi bi-check step-check fs-4 ",
          alt: "Bootstrap",
          width: "32",
          height: "32",
          style: { color: props.currentColor, borderColor: color }
        })

      } else {
        data = h('span', { class: "" }, [i + 1])
      }
      steps.push(h('div', {
        class: 'step-indicator',
        style: { color, borderColor: isPass ? props.currentColor : color },
        on: {
          click: () => props.handleClick && props.handleClick(i)
        }
      }, [data]))
    }
    const attrs = assign({}, data, {
      class: ['step-indicators', data.class, 'mb-5']
    })

    setTimeout(() => {

      if (process.browser) {
        const el = document.querySelectorAll(".step-check");
        for (let index = 0; index < el.length; index++) {
          const ele = el[index];
          ele.style.width = '24px'
          ele.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY2xhc3M9ImJpIGJpLWNoZWNrIiBmaWxsPSJjdXJyZW50Q29sb3IiPgoKIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBmaWxsPSIjMTBhMjU0IiBpZD0ic3ZnXzEiIGQ9Im0xMC45Nyw0Ljk3YTAuNzUsMC43NSAwIDAgMSAxLjA3LDEuMDVsLTMuOTksNC45OWEwLjc1LDAuNzUgMCAwIDEgLTEuMDgsMC4wMmwtMi42NDYsLTIuNjQ2YTAuNzUsMC43NSAwIDEgMSAxLjA2LC0xLjA2bDIuMDk0LDIuMDkzbDMuNDczLC00LjQyNWEwLjI2NywwLjI2NyAwIDAgMSAwLjAyLC0wLjAyMmwtMC4wMDEsMHoiLz4KIDwvZz4KPC9zdmc+"
        }
      }
    }, 100);

    return h('div', attrs, [
      h('span', { class: 'step-indicators-line', style: { background: 'rgb(218, 215, 215)' } }),
      ...steps
    ])
  }
}
