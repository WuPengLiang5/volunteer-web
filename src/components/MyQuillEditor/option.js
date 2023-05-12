const toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'direction': 'rtl'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],
    [{'font': []}],
    [{'align': []}],
    ['clean'],
    ['link', 'image', 'video']
];

export default {
    modules: {
        toolbar: {
            container: toolbar,
            handlers: {
                // 'link': (value) => {
                //     console.log('自定义上传文件',value);
                //     document.querySelector('.upload-annex button').click();
                // }
                'image': (value) => {
                    if (value) {
                        // 调用iview图片上传
                        document.querySelector('.upload-annex button').click()
                    } else {
                        this.quill.format('image', false);
                    }
                }
            }
        },
        imageResize: {            //图片缩放配置
            displayStyles: {
                backgroundColor: "black",
                border: "none",
                color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
        },
        imageDrop: false,       //图片拖拽配置,false为开启拖拽,true关闭拖拽1
    },
    placeholder: '请输入正文......'
}
