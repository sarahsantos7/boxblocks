class Editor {

    static desenhaCores(cores) {
        const divCores = document.getElementById("cores")
        const size = 40

        let html = ""
        Object.keys(cores).forEach(cor => {
            html += "<div style='display: inline-block; text-align: center; height: " + size + "px; width: " + size + "px; background-color: " + cores[cor]  + "'> " + cor + "&nbsp;</div>"
        });

        divCores.innerHTML = html
    }

}

export default Editor