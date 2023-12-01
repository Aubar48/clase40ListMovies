window.onload = async () => {
    let query = new URLSearchParams(location.search)
    console.log();
    try {
        const response = await fetch(`http://localhost:3031/api/movies/${query.get('movie')}`)
        const result = await response.json()
        console.log(result);
    } catch (error) {
        console.log(error);
    }





}