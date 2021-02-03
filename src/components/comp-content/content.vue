
<script>
import { reactive, h } from 'vue'
import { slotTest } from  '../comp-slot-test'

export default {
  name: 'comp-content',
  components: {
    slotTest
  },
  setup() {
    const observea = reactive({
      title: 11
    })
    setTimeout(function() {
      observea.title = 22
    }, 2000)
    return () => h(slotTest, {
      data: observea.title
    }, {
      default: () => h('div', observea.title),
      footer: () => h('div', observea.title)
    })
  }
}
</script>