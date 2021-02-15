import { h, Suspense, defineAsyncComponent, onErrorCaptured, ref, getCurrentInstance, Fragment } from 'vue'
import { wrapTemplate } from './wrapTemplate'

const baseLoaderDefaultOptions = {
  minTime: 0,
  timeout: 0
}

const pluginOptions = {}

function sleep(time) {
  if (!time) {
    return true
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time);
  })
}

function throwError(errMessage) {
  throw new Error(errMessage)
}

function noop() {}

function createLoaderFunc(componentPath, options = baseLoaderDefaultOptions) {
  const { minTime, loaderTimeout, onComponentLoadStatus = noop } = options
  return function importComponent() {
    let timer
    if (loaderTimeout) {
      timer = setTimeout(() => {
        onComponentLoadStatus({
          error: new Error(`load ${componentPath} timeout`),
          loaded: false
        })
      }, loaderTimeout);
    }
    return Promise.all([
      import(/* webpackChunkName: "[request]"*/ `~components/${componentPath}`),
      sleep(minTime)
    ]).then(([componentObject]) => {
      onComponentLoadStatus({
        loaded: true
      })
      return componentObject
    }).finally(() => {
      clearTimeout(timer)
    })
  }
}

const asyncLoaderDefaultOptions = {
  loadingComponent: h('div', null, 'loading...'),
  errorComponent: {
    props: {
      error: Error
    },
    render({$props}) {
      return h('div', null, [$props.error.message])
    }
  }
}

function setAsyncLoaderOptions (options = {}) {
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      const value = options[key];
      pluginOptions[key] = value     
    }
  }
}

export function optionAsyncLoader(componentPath, options = {}) {
  const { 
    errorComponent = asyncLoaderDefaultOptions.errorComponent, 
    loadingComponent = asyncLoaderDefaultOptions.loadingComponent
  } = options
  const { onComponentLoadStatus } = options
  const asyncComponentOptions = {
    loader: createLoaderFunc(componentPath, {
      minTime: options.minTime,
      timeout: options.loaderTimeout,
      onComponentLoadStatus
    }),
    loadingComponent: loadingComponent,
    errorComponent: errorComponent,
    onError(error, retry, fail, attempts) {
      const needRetry = typeof options.shouldRetry === 'function' && options.shouldRetry(error, attempts)
      if (needRetry || attempts <= (options.attempts || 0)) {
        retry()
      } else {
        fail()
      }
    },
    ...options,
  }
  const asyncComponentWrpper = defineAsyncComponent(asyncComponentOptions)
  return asyncComponentWrpper
}

function useComponentStatus() {
  const error = ref(null)
  const loaded = ref(false)

  function setError(e) {
    error.value = e instanceof Error ? e : new Error(String(e))
    return true
  }

  function retry () {
    loaded.value = false
    error.value = null
  }

  function setLoaded(value) {
    loaded.value = value
  }

  function setComponentLoadStatus({ loaded: loadedValue, error: errorValue }) {
    if (typeof loadedValue === 'boolean') {
      setLoaded(true)
    }
    if (errorValue instanceof Error) {
      setError(errorValue)
      setLoaded(false)
    }
  }

  onErrorCaptured(setError)

  return {
    error,
    retry,
    setComponentLoadStatus
  }
}

function useDelay(delay) {
  const delayed = ref(!!delay)
  if (delay) {
    setTimeout(() => {
      delayed.value = false
    }, delay);
  }
  return {
    delayed,
  }
}

function normalizeSuspenseDefaultSFC(componentPath, options) {
  let asynComponent = null
  if (typeof componentPath === 'object' && componentPath.setup) {
    const originSetup = componentPath.setup
    const { minTime } = options
    asynComponent = { ...componentPath }
    if (minTime) {
      asynComponent.setup = function () {
        return Promise.all([originSetup.call(this), sleep(minTime)]).then(([setupState]) => {
          return setupState
        })
      }
    }
  } else if (typeof componentPath === 'string') {
    asynComponent = optionAsyncLoader(componentPath, options)
  } else {
    return null
  }
  return asynComponent
}


export function asyncLoader (componentPath, options = {}) {
  return {
    name: 'asyncLoaderWrapper',
    emits: ['resolve', 'fallback', 'pending'],
    setup(props, { slots }) {
      const { retry, error, setComponentLoadStatus } = useComponentStatus()
      const { 
        errorComponent, 
        loadingComponent,
        delay,
        ...defineAsyncOptions 
      } = { ...asyncLoaderDefaultOptions, ...pluginOptions, ...options, }
      defineAsyncOptions.onComponentLoadStatus = setComponentLoadStatus

      const instance = getCurrentInstance()
      const optionsComponent = normalizeSuspenseDefaultSFC(componentPath, defineAsyncOptions)
      const defaultChildVnode = h(optionsComponent, self.$attrs, slots)
      defaultChildVnode.ref = instance.vnode.ref

      return (self) => {
        if (error.value) {
          return h(errorComponent, { error: error.value, retry })
        }

        return h(Suspense, {
          onFallback(...args) {
            self.$emit('fallback', ...args)
          },
          onResolve(...args) {
            self.$emit('resolve', ...args)
          },
          onPending(...args) {
            self.$emit('pending', ...args)
          },
        }, {
          default: wrapTemplate(defaultChildVnode),
          // fallback 变动好像会导致 default 重新渲染, delay 只能放 fallback 里执行
          fallback: wrapTemplate(h({
            props: {
              loadingDelay: Number
            },
            setup(props) {
              // patch 的时候 container 是 null. 
              // component effect 的时候, prevTree = instance.subTree 居然是 comment 节点
              // hostParentNode(prevTree.el) 寻找父节作为 patch 的 container 为 null. 导致插入节点失败
              // 原因: fallback 的 rerender 后. Suspense 没有更新 subTree.
              // vue3 slot 只能加载 templte 上. 除非只有 defualt 插槽
              const { delayed } = useDelay(props.loadingDelay)
              return () => !delayed.value ? h(loadingComponent) : null
            }
          }, {
            loadingDelay: delay
          }))
        })
      }
    }
  }
}

export default function install(app, options) {
  setAsyncLoaderOptions(options)
}