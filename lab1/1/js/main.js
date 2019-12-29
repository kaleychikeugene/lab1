var user = {};
$(document).ready(function () {

    var Validation = (function () {
        var isRequire = function (value) {
            return value == "";
        };
        var isChecked = function (el) {
            var hasCheck = false;
            el.each(function () {
                if ($(this).prop('checked')) {
                    hasCheck = true;
                }
            });
            return hasCheck;
        };
        return {
            isRequire,
            isChecked
        };
    })();

    var required = $('form').find('[data-required]');
    var once = $('form').find('[data-once]');
    var radios = $('.form-item-triple');
    var groups = [];
    radios.each(function () {
        groups.push($(this).find('[data-once]'));
    });

    $('#form').on('submit', function (e) {
        e.preventDefault();
        let valid = true;
        required.each(function () {
            if (Validation.isRequire($(this).val())) {
                $(this).siblings('small.errorReq').show();
                valid = false;
            } else {
                $(this).siblings('small.errorReq').hide();
            }
        });
        $.each(groups, function () {
            if (!Validation.isChecked($(this))) {
                $(this).parents('.form-item').find('small.errorOnce').show();
                valid = false;
            } else {
                $(this).parents('.form-item').find('small.errorOnce').hide();
            }
        });

        if (valid) {
            user.lastName = $('#lastName').val()
            user.firstName = $('#firstName').val()
            user.gender = $('#Male').prop('checked') ? 'Мужской' : 'Женский'
            user.age = $('#age').val()
            user.username = $('#username').val()
            user.password = $('#password').val()
            user.email = $('#email').val()
            user.country = $('#country').val()
            user.phone = $('#phone').val()

            $('body').html(content)
            $(".startButton").on("click", function () {
                $(".startButton").attr('hidden', true);
                $(".nextButton").attr('hidden', false);
                $(".cancelButton").attr('hidden', false);
                $("#quiz1").hide();
                startTest();
            })
        }
    });
});

var questions = [{
    question: "1. Вам предстоит деловая встреча. Выбивает ли вас ее ожидание из колеи?"
}, {
    question: "2. Откладываете ли вы визит к врачу до тех пор, пока станет уже невмоготу?"
}, {
    question: "3. Вызывает ли в вас неудовольствие и даже смятение поручение выступить с докладом, сообщением, информацией на каком-либо совещании?"
}];


var currentQuestion = 0;
var viewingAns = 0;
var correctAnswers = 0;
var quizOver = false;
var iSelectedAnswer = [];
var c = 180;
var t;
var start = new Date()
var time;

function startTest() {
    setInterval(() => {
        var s = new Date() - start;
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        t = mins + ' минут ' + secs + ' секунд'
    }, 1000)

    displayCurrentQuestion();

    $(".nextButton").on("click", function () {
        if (!quizOver) {

            var val = $("input[type='radio']:checked").val();

            iSelectedAnswer[currentQuestion] = val;

            currentQuestion++;

            if (currentQuestion < questions.length) {
                displayCurrentQuestion();

            } else {
                displayScore();
                $(document).find(".nextButton").text("Начать с начала");
                $(document).find(".cancelButton").attr('hidden', true);
                quizOver = true;
                return false;

            }

        } else {
            quizOver = false;
            iSelectedAnswer = [];
            $(document).find(".nextButton").text("Next Question");
            $(document).find(".preButton").text("Previous Question");
            $(".preButton").attr('disabled', 'disabled');
            resetQuiz();
            viewingAns = 1;
            displayCurrentQuestion();
            hideScore();
        }
    });
}

function displayCurrentQuestion() {

    var question = questions[currentQuestion].question;
    var questionClass = $(document).find(".quizContainer > .question");
    var choiceList = $(document).find(".quizContainer > .choiceList");
    $(questionClass).text(question);
    $(choiceList).find("li").remove();
    var choice;

    var choices = ['Да', 'Нет', 'Иногда'];

    for (i = 0; i < choices.length; i++) {
        choice = choices[i];

        if (iSelectedAnswer[currentQuestion] == i) {
            $('<li><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
        } else {
            $('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
        }
    }
}

function resetQuiz() {
    currentQuestion = 0;
    correctAnswers = 0;
    hideScore();
}

function displayScore() {
    var result = 0;
    var text;
    iSelectedAnswer.forEach(it => {
        if (it == 0) {
            result += 2
        } else if (it == 2) {
            result += 1
        }
    })
    $(document).find(".quizContainer > .question").hide();
    $(document).find(".quizContainer > .choiceList").hide();

    if (result <= 5) {
        text = "Ваша общительность явно чрезмерна, вы говорливы, многословны, вмешиваетесь в дела, которые не имеют к вам никакого отношения. Вспыльчивы, обидчивы, нередко необъективны. Людям трудно с вами."
    } else if (result > 5 && result < 14) {
        text = "Вы, должно быть, рубаха-парень: всюду чувствуете себя в своей тарелке, охотно высказываетесь по любому вопросу, даже если имеете о нем поверхностное представление, беретесь за любое дело, хотя не всегда можете успешно довести его до конца. Задумайтесь над этим."
    } else if (result > 13 && result < 19) {
        text = "У вас нормальная коммуникабельность. Без неприятных переживаний начинаете новое дело, идете на встречу с новыми людьми. Хотя, вероятно, не любите шумных компаний, многословие вас раздражает."
    } else if (result > 18 && result < 25) {
        text = "Вы достаточно общительны, в незнакомой обстановке чувствуете себя вполне уверенно. В ваших высказываниях может быть порой слишком много сарказма, причем без веских оснований. Но эти недостатки исправимы."
    } else if (result > 24 && result < 30) {
        text = "Вы замкнуты, неразговорчивы, предпочитаете одиночество, поэтому у вас мало друзей."
    } else {
        text = "Вы явно некоммуникабельны, и это беда, от которой страдаете больше всего вы сами."
    }

    $(document).find(".quizContainer > .result").text("Результат: " + text + ' Время - ' + t+'. '+user.firstName+' '+user.lastName);
    $(document).find(".quizContainer > .result").show();
}

function hideScore() {
    $(document).find(".result").hide();
}

function viewResults() {

    if (currentQuestion == 10) {
        currentQuestion = 0;
        return false;
    }
    if (viewingAns == 1) {
        return false;
    }

    hideScore();
    var question = questions[currentQuestion].question;
    var questionClass = $(document).find(".quizContainer > .question");
    var choiceList = $(document).find(".quizContainer > .choiceList");
    var numChoices = questions[currentQuestion].choices.length;
    $(questionClass).text(question);
    $(choiceList).find("li").remove();
    var choice;


    for (i = 0; i < numChoices; i++) {
        choice = questions[currentQuestion].choices[i];

        if (iSelectedAnswer[currentQuestion] == i) {
            if (questions[currentQuestion].correctAnswer == i) {
                $('<li style="border:2px solid green;margin-top:10px;"><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            } else {
                $('<li style="border:2px solid red;margin-top:10px;"><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            }
        } else {
            if (questions[currentQuestion].correctAnswer == i) {
                $('<li style="border:2px solid green;margin-top:10px;"><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            } else {
                $('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            }
        }
    }

    currentQuestion++;

    setTimeout(function () {
        viewResults();
    }, 3000);
}
var content = `
<div id="container">
            <header>
                <img src="static/logo.png" height="40px"> Заголовок сайта
            </header>
            <hr style="width: inherit" size="3" noshade>
            <main>
                <div id="menu">
                    <ul>
                        <li><a href="">1</a></li>
                        <li><a href="">2</a></li>
                        <li><a href="">3</a></li>
                    </ul>
                    <hr id='vertical'>
                </div>
                <div id="info">
                    <div class="quizContainer container-fluid well well-lg">
                        <div id="quiz1" class="text-center">
                            <h4>Коммуникабельность</h4>
                            <span>Пожалуйста, на вопросы, приведенные ниже, дайте односложный ответ: "да", "нет", "иногда".</span>
                        </div>
                        <div class="question"></div>
                        <ul class="choiceList"></ul>
                        <div class="result"></div>
                        <button class="startButton">Начать</button>
                        <button class="nextButton" hidden>Следующий вопрос</button>
                        <button class="cancelButton" hidden>Отмена</button>
                    </div>
                </div>
            </main>
            <footer id="footer">
                Калейчик Евгений, МАГ 40-21, 08.10.2019, kaleychikeugene@icloud.com
            </footer>
        </div>
`
