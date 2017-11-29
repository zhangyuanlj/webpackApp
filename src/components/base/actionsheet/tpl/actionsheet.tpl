<div class="c-modal">
    {{if isPop}}
        <div id="{{id}}" class="c-actionsheet-pop">
            <div class="c-actionsheet-scroll">
                <div class="c-actionsheet-list">
                    {{each dataConfig.itemList as value i}}
                        <div class="item" data-index="{{i}}">{{value.name}}</div>
                    {{/each}}
                </div>
            </div>
        </div>
    {{else}}
        <div id="{{id}}" class="c-actionsheet">
            {{if dataConfig.title.show}}
                <div class="c-actionsheet-title">
                    <h4>{{dataConfig.title.name}}</h4>
                    <p>{{dataConfig.title.describe}}</p>
                </div>
            {{/if}}
            <div class="c-actionsheet-list">
                {{each dataConfig.itemList as value i}}
                    <div class="item" data-index="{{i}}">{{value.name}}</div>
                {{/each}}
            </div>
            {{if cancel.show}}
                <div class="c-actionsheet-list">
                    <div class="item cancel-btn">{{cancel.name}}</div>
                </div>
            {{/if}}
        </div>
    {{/if}}
</div>