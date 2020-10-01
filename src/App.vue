<template>
    <div id="app">
        <Header/>
        <div id="content">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import Header from './components/Header'

    export default {
        name: 'App',
        components: {
            Header
        },
        mounted() {
            this.$fetch.Get('/connect1.php').then(res => {
                if (res.code === 200) {
                    this.$store.commit('SET_CROSSING', res.data)
                }
            })
        }
    }
</script>
