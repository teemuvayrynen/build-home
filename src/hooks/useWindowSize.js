import { useState, useEffect } from "react";

function debounce(fn, ms) {
  let timer 
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }, 1000)

    window.addEventListener("resize", debouncedHandleResize)

    return () => window.removeEventListener("resize", debouncedHandleResize)
  }, [])

  return windowSize
}

export default useWindowSize