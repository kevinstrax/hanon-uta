import { onBeforeUnmount, onMounted, type Ref, ref } from "vue";

export const useBackTop = (isMobile: Ref<boolean>) => {
    const showBackTop = ref(false)

    function backToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function handleScroll() {
        showBackTop.value = window.scrollY > 808
    }

    onMounted(() => {
        isMobile && window.addEventListener('scroll', handleScroll)
    })

    onBeforeUnmount(() => {
        isMobile && window.removeEventListener('scroll', handleScroll)
    })
    return {
        showBackTop, backToTop,
    }
}