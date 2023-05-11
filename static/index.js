// $(document).ready(function(){ })와 같음.
$(function() { 
    listing();
});

// READ
function listing() {
    fetch('/movieworld').then((res) => res.json()).then((data) => {
        let rows = data['result']
        $('.box2Container').empty();
        rows.forEach((a) => {
            let comment = a['comment'];
            let title = a['title'];
            let image = a['image'];
            let score = a['score'];
            let genre = a['genre'];
            let m_id = a['m_id']
            let trailer = a['trailer'].substring(a['trailer'].indexOf("=") + 1); //trailer URL에서 유튜브ID만 따옴

            let temp_html = `<div id="${genre}" class="box2 on">
                                <div class="imageBox" style="background-image: url(${image});"></div>
                                <span class="delete_test" id="${m_id}" onclick="delete_test(${m_id})">❌</span>
                                <ul class="list">
                                <div><li class="ListBox">제목 : ${title}</li></div>
                                    <div><li class="ListBox">평점 : ${score}</li></div>
                                    <div><li class="ListBox">장르 : ${genre}</li></div>
                                    <div><li class="ListBox">코멘트 : ${comment}</li></div>

                                    <!-- 모달열기 아이콘 링크. 모달창 ID를 data-bs-target="#exampleModal-${trailer}"로 잡아줘야 모달창마다 다른 트레일러 주소가 할당됨.-->  
                                    <div>
                                        <a class="modal-a" data-bs-toggle="modal" data-bs-target="#exampleModal-${trailer}">
                                            <i class="fa-brands fa-youtube Youtube-Icon"></i>
                                        </a>
                                        <!-- 모달창 -->
                                        <div class="modal fade" id="exampleModal-${trailer}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered modal-lg">
                                                <div class="modal-content modal-container">
                                                    <div class="modal-body modal-body-bg">
                                                        <!--유튜브 비디오 iframe -->
                                                        <iframe 
                                                            width=100% height=100% 
                                                            src="https://www.youtube.com/embed/${trailer}" 
                                                            title="YouTube video player" frameborder="0" 
                                                            allow="accelerometer; autoplay; clipboard-write; 
                                                            encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                                                        </iframe>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <li class="ListBox">좋아요</li>
                                </ul>
                            </div>`;
            $('.box2Container').prepend(temp_html); // prepend 는 내림차순.
            
            //모달 끄면(hide.bs.modal) 영상 중지.
            $(`#exampleModal-${trailer}`).on('hide.bs.modal', function (e) {
                // 모달 창 내부에 있는 iframe요소를 찾음.
                let iframe = $(this).find('iframe');
                // attr()메서드를 사용하여 iframe 요소의 src 속성값을 가져온 후,
                let videoSrc = iframe.attr('src');
                // iframe 요소의 src 속성값을 빈 문자열로 설정하여 영상 중지
                iframe.attr('src', '');
                // src 속성값을 이전값(videoSrc)으로 설정하여 원래 영상을 다시 시작할 수 있도록 함.
                iframe.attr('src', videoSrc);
            });
        });
    })
}

// CREATE
function posting() {
    let url = $('#url').val()
    let comment = $('#comment').val()
    let trailer =$('#trailer').val()

    let formData = new FormData();
    formData.append("url_give", url);
    formData.append("comment_give", comment);
    formData.append("trailer_give", trailer);

    fetch('/movieworld', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
        alert(data['msg'])
        // 새로고침
        window.location.reload()
    })
}

// DELETE. jquery로 이벤트가 작동하지 않아서 onclick을 사용했다. 
// html내부의 onclick에서 m_id를 인자로 넘기기에 받기위해 m_id를 지정.
function delete_test(m_id) {
    let formData = new FormData();
    formData.append("m_id_give", m_id);
    fetch('/movieworld_delete', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
        alert(data['msg'])
        //새로고침
        window.location.reload()
    })
}