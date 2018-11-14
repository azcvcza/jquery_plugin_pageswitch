(function($){
    var privateFunction = function(){

    }
    var PageSwitch =(function(){
        function PageSwitch(element,options){
            this.settings = $.extend(true,$.fn.PageSwitch.default,options||{});
            this.element = element;
            this.init();
        }
        PageSwitch.prototype = {
            init:function(){
                //init dom
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.selectors.sections;
                me.section = me.selectors.section;
                
                me.direction = me.settings.direction=="vertical"?true:false;
                me.index = (me.settings.index>=0 && me.settings.index< this.pagesCount)?me.settings.index:0;
                if(!me.direction){
                    me._initLayout();
                }
                if(me.settings.pagination){
                    me._initPageing();
                }
                me._initEvent();
            },
            pagesCount:function(){
                //get page count
                return this.section.length;
            },
            switchLength:function(){
                //get slide width
                return this.direction?this.element.height():this.element.width();
            },
            _initLayout:function(){
                //herizental or vertical
                var me = this;
                var width = (me.pagesCount*100)+"%";
                var cellWidth = (100/me.pagesCount).toFixed(2)+"%";
                me.sections.width(width);
                me.section.width(cellWidth).css("float","left");
            },
            _initPageing:function(){
                //make structure of element & css
                var me =this;
                var pageClass = me.selectors.page.substring(1);
                var activeClass = me.selectors.active.substring(1);
                var pageHtml = "<ul class="+pageClass+">";
                for(var i =0;i<me.pagesCount;i++){
                    pageHtml+="<li></li>";
                }
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if(me.direction){
                    pages.addClass("vertical");
                }
                else{
                    pages.addClass("horizental");
                }
            },
            _initEvent:function(){
                //init event
                var me = this;
                me.element.on("click",me.selectors.pages+"li",function(){
                    me.index = $(this).index();
                    me._scrollPage();
                });
                me.element.on("mousewheel DOMMouseScroll",function(e){
                    var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                    if(delta>0 &&(me.index && !me.settings.loop || me.settings.loop)){
                        me.prev();
                    }
                    else if(delta<0 && (me.index<(me.pageCount-1) && !me.settings.loop || me.settings.loop)){
                        me.next();
                    }
                });
                if(me.settings.keyboard){
                    $(window).on("keydown",function(e){
                        var keyCode = e.keyCode;
                        // left:37 ,up:38,right:39,down:40
                        if(keyCode == 37 || keyCode==38){
                            me.prev();
                        }else if(keyCode ==39 ||keyCode==40){
                            me.next();
                        }

                    })
                };
                $(window).resize(function(){
                    var currentLength = me.switchLength();
                    var offset = me.settings.direction?me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;

                    if(Math.abs(offset)>currentLength/2 && me.index<(me.pageCount-1)){
                        me.index++;
                    }
                    if(me.index){
                        me._scrollPage();
                    }
                });
                me.sections.on("transitionend",function(){
                    if(me.settings.callback && $.type(me.settings.callback)==='function'){
                        me.settings.calback();
                    }
                })
            },
            prev:function(){
                var me = this;
                if(me.index>0){
                    me.index --;
                }else if(me.settings.loop){
                    me.index = me.pageCount - 1;
                }
                me._scrollPage();
            },
            next:function(){
                var me = this;
                if(me.index<me.pagesCount){
                    me.index++;
                }else if(me.settings.loop){
                    me.index = 0;
                }
                me._scrollPage();
            }
        }
        return PageSwitch;
    })();
    $.fn.PageSwitch = function(options){
        return this.each(function(){
            var me = $(this),
                instance =me.data("PageSwitch");
                if(!instance){
                    instance = new PageSwitch(me,options);
                    me.data("PageSwitch",instance);
                }
                if($.type(options) ==="string"){
                    return instance[options]();
                }
                
        });
    }
    //默认参数
    $.fn.PageSwitch.default = {
        selectors:{
            sections:".sections",
            section:".section",
            page:".pages",
            active:".active", 
        },
        index:0,
        easing:"easing",
        duration:500,
        loop:false,
        pagination:true,
        keyboard:true,
        direction:"vertical",//horizental
        calback:""
    }
})(jQuery)