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
        }
    }
</script>
