<div id="c-nav" class="c-nav">
    <ul class="inner">
        {{each list as value i}}
            <li class="item" data-url="{{value.url}}">
                <i class="{{value.styleName | setClass}}">
                    {{if value.news && value.news.show}}
                        <span class="num">{{value.news.num}}</span>
                    {{/if}}
                </i>
                <h4>{{value.name}}</h4>
            </li>
        {{/each}}
    </ul>
</div>