import { onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";

export const useScreenSize = () => {

    const isSmallScreen = ref(false)
    const checkScreenSize = () => {
        isSmallScreen.value = window.innerWidth <= 370
    }

    const isMobile = ref(false)
    onBeforeMount(() => {
        isMobile.value = window.innerWidth < 768
    })

    onMounted(() => {
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('resize', checkScreenSize)
    })

    return {
        isMobile, isSmallScreen,
    }
}