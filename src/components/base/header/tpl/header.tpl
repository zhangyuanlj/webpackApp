<div id="{id}" class="c-header">
    {{if data.left}}
        <div class="left">
            {{each data.left as left}}
                <a href="javascript:void(0);" class="icon" data-name="{{left.name}}">
                    {{if left.icon}}
                        <i class="{{left.icon | setClass}}"></i>
                    {{/if}}
                    {{if left.text}}
                        <span>{{left.text}}</span>
                    {{/if}}
                </a>
            {{/each}}
        </div>
    {{/if}}
    {{if data.right}}
        <div class="right">
            {{each data.right as right}}
                <a href="javascript:void(0);" class="icon" data-name="{{right.name}}">
                    {{if right.icon}}
                        <i class="{{right.icon | setClass}}"></i>
                    {{/if}}
                    {{if right.text}}
                        <span>{{right.text}}</span>
                    {{/if}}
                </a>
            {{/each}}
        </div>
    {{/if}}
    <div class="text">
        <h4>{{data.title}}</h4>
    </div>
</div>