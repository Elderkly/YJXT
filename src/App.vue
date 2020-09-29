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
            const data = {
                routename: 'yunnan-101',
                start_time: '2020-09-27',
                end_time: '2020-09-27',
                datatype: '预警次数',
                ratio: 10
            }
            fetch('http://134.175.65.106/statistics/statistics1.0.php?',{
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify(data), // must match 'Content-Type' header
            })
            .then(res => res.json())
            .then(res => {
                console.log('123123',res)
            })
        }
    }
</script>
