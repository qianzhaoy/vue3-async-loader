import { h, Suspense, defineAsyncComponent, onErrorCaptured, ref, getCurrentInstance, Fragment  } from 'vue'

const baseLoaderDefaultOptions = {
  timeout: 0,
  delay: 0,
  errorComponent: undefined,
  loadingComponent: undefined,
  attempts: 0
}

const pluginOptions = {}

function noop() {}

function wrapTemplate(children) {
  if (!Array.isArray(children)) {
    children = [children]
  }
  return () => h(Fragment, null, children)
}

function importComponent(componentPath, options = baseLoaderDefaultOptions) {
  const { timeout, onComponentLoadStatus = noop } = options
  let _timer
  if (timeout) {
    _timer = setTimeout(() => {
      onComponentLoadStatus({
        error: new Error('加载组件超时'),
        loaded: false
      })
    }, timeout);
  }

  function _importComp() {
    if (typeof componentPath === 'function') {
      return componentPath()
    } else {
      return import(/* webpackChunkName: "[request]"*/ `~/components/${componentPath}`)
    }
  }

  return _importComp().then((componentObject) => {
    onComponentLoadStatus({
      loaded: true
    }) 
    return componentObject
  }).finally(() => {
    clearTimeout(_timer)
  })
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

function createAsyncCompBy(componentPath, options = {}) {
  const asyncComponentOptions = {
    loader: () => importComponent(componentPath, options),
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
  let asynComponent = componentPath
  if (typeof componentPath === 'string' || typeof componentPath === 'function') {
    asynComponent = createAsyncCompBy(componentPath, options)
  }
  return asynComponent
}

function createInnerComp(
  comp,
  {
    vnode: { ref, props, children }
  }
) {
  const compVnode = h(comp, props, children)
  // ref 透传
  compVnode.ref = ref
  return compVnode
}


export function asyncLoader (componentPath, options = {}) {
  return {
    name: 'asyncLoaderWrapper',
    emits: ['resolve', 'fallback', 'pending'],
    inheritAttrs: false,
    /* 骗过上帝
    https://github.com/vuejs/core/blob/main/packages/runtime-core/src/rendererTemplateRef.ts#L43
    setRef 时，通过 __asyncLoader 字段判断来跳过该组件 ref 的设置。再通过 render 函数把 ref 字段赋值给我们想要透传的组件的 vnode 即可完成 forWardRef
    */
    __asyncLoader: Promise.resolve(),
    setup(props, { emit }) {
      const { retry, error, setComponentLoadStatus } = useComponentStatus()
      const { 
        errorComponent, 
        loadingComponent,
        delay,
        ...defineAsyncOptions 
      } = { ...asyncLoaderDefaultOptions, ...pluginOptions, ...options, }

      const instance = getCurrentInstance()

      const optionsComponent = normalizeSuspenseDefaultSFC(componentPath, {
        ...defineAsyncOptions,
        onComponentLoadStatus: setComponentLoadStatus
      })

      return () => {
        if (error.value) {
          return h(errorComponent, { error: error.value, retry })
        }

        const defaultChildVnode = createInnerComp(optionsComponent, instance)

        const fallbackVnode = h({
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
        })

        return h(Suspense, {
          onFallback(...args) {
            emit('fallback', ...args)
          },
          onResolve(...args) {
            emit('resolve', ...args)
          },
          onPending(...args) {
            emit('pending', ...args)
          },
        }, {
          default: wrapTemplate(defaultChildVnode),
          // fallback 变动好像会导致 default 重新渲染, delay 只能放 fallback 里执行
          fallback: wrapTemplate(fallbackVnode)
        })
      }
    }
  }
}

export default function install(app, options) {
  setAsyncLoaderOptions(options)
}