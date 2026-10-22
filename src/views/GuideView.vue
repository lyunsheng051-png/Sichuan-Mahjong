<script setup lang="ts">
import TileHand from '../components/TileHand.vue'
const stages = [
  { title: '先看成几组', duration: '第1—3次练习', body: '每天先练3分钟手牌快照，再练3分钟开牌碰杠。先给自己12秒，重点记对子、刻子；不要要求自己背出整副手牌。', gate: '参考进阶线：最近20道手牌题独立答对至少18道，且错误不是集中漏同一种牌。', to: '/train/memory' },
  { title: '注意力离开，也能接回来', duration: '第4—7次练习', body: '碰杠练习打开“收起手牌”，先用12秒，稳定后降到8秒。看见对手出牌时，先报牌名，再核对你的对子和刻子。', gate: '参考进阶线：至少20道收牌碰杠题，独立准确率达到90%；先准确，再考虑缩短时间。', to: '/train/claim' },
  { title: '认出听牌的结构', duration: '第8—14次练习', body: '每天5分钟听牌侦探、4分钟打哪张能听。先自己说出完整组、将牌和剩余搭子，提交后对照拆法。七对需要另外检查。', gate: '参考进阶线：连续两次各做20题，独立准确率达到90%，还能够说清楚为什么听这些牌。', to: '/train/wait' },
  { title: '从屏幕搬到实物牌', duration: '达标后持续练', body: '用实物摆13张牌，先写下听口，再录入手牌实验室核对。请亲友慢速陪练，摸打后更新对子、刻子、听口三项。把遗漏记下来，下次专项练。', gate: '接下来才练对局中的牌河、可见余牌、防守、番型和结算。本版本集中解决认牌与听牌，尚未提供完整四人对局。', to: '/lab' },
]
const groups = [[0,1,2],[3,4,5],[9,10,11],[13,13],[15,16]]
</script>
<template>
  <section class="page-heading"><div><p class="eyebrow">你的第一本上桌手册</p><h1>把“我不会”，<br />拆成可以练的小动作。</h1><p class="muted">这里的天数与门槛是练习建议，不是速成保证。按准确率调整节奏。</p></div></section>
  <section class="guide-intro"><article><span class="eyebrow">你遇到的第一个卡点</span><h2>看着牌认识，转头却忘了。</h2><p>这不等于记性差。你可能还在逐张记牌，注意力一切换，就需要从头再找。先把手牌整理成“完整组、对子、搭子、孤张”，碰杠时只核对其中的对子与刻子。</p><p class="tip-line">实战小动作：摸打之后，在心里更新一遍“对子是什么、刻子是什么”。</p></article><article><span class="eyebrow">你遇到的第二个卡点</span><h2>会扔差牌，却看不见听牌。</h2><p>选出不好用的牌，和判断整手能不能胡，是两种不同的任务。听牌要检查：加进哪一张后，所有牌恰好能拆成合法组合。已经有完整组时，也可能需要重新拆组，不能永远锁死。</p><p class="tip-line">实战小动作：打牌前检查一次“这张打完，我等什么？”允许答案是“还没听”。</p></article></section>
  <section class="white-panel listening-lesson"><p class="eyebrow">听牌不是感觉，是补一张能不能拼完整</p><h2>先学会看这副牌</h2><div class="shape-groups"><div v-for="(group,i) in groups" :key="i"><TileHand :hand="group" /><span>{{ i < 3 ? '完整顺子' : i === 3 ? '将牌' : '未完成搭子' }}</span></div></div><p>已经有三组顺子、一对将，最后是七条、八条。补六条可以组成六七八，补九条可以组成七八九，所以听<strong>六条、九条</strong>。</p><div class="pattern-grid"><div><h3>两面</h3><TileHand :hand="[3,4]" small /><p>四五万 → 三万、六万</p></div><div><h3>嵌张</h3><TileHand :hand="[3,5]" small /><p>四六万 → 五万</p></div><div><h3>边张</h3><TileHand :hand="[0,1]" small /><p>一二万 → 三万</p></div><div><h3>单钓将</h3><TileHand :hand="[4]" small /><p>四组已齐，单张五万 → 五万</p></div></div><p class="micro-copy">这些是局部形状示例。实际听口必须检查整手牌，也要排除已经持有四张的“第五张牌”。七对、双碰和复合听口也不能漏。</p></section>
  <div class="section-heading"><div><p class="eyebrow">一次15—20分钟，够专注就好</p><h2>从入门到能独立上桌</h2></div></div>
  <section class="learning-path"><article v-for="(stage,i) in stages" :key="stage.title"><span class="path-step">{{ i+1 }}</span><div><p class="eyebrow">{{ stage.duration }}</p><h3>{{ stage.title }}</h3><p>{{ stage.body }}</p><p class="milestone">{{ stage.gate }}</p><RouterLink :to="stage.to" class="text-link">去练这个动作 ↗</RouterLink></div></article></section>
  <section class="white-panel"><h2>坐到亲友桌前，只带这张小抄</h2><ol class="table-checklist"><li><strong>换三张：</strong>先分花色，选同花色三张；收到新牌再整理、定缺。</li><li><strong>别人出牌：</strong>先看是不是定缺，再核对自己的对子和刻子。发现能碰杠后，再决定值不值得。</li><li><strong>自己摸打：</strong>优先出完定缺牌，更新手牌结构；准备出牌前问自己“打完听什么”。</li><li><strong>刚刚听牌：</strong>在心里说出全部听口。后续摸打或碰杠后，重新检查，旧听口可能改变。</li></ol><p>不必用脑科学术语要求自己“改造大脑”。我们练的是更稳定的观察顺序、牌型识别和注意力切换；能否迁移到牌桌，要用实物练习检验。</p></section>
  <section class="source-note"><h3>规则与素材说明</h3><p>本项目采用约定的练习规则：108张万条筒、换同花色三张后定缺、缺门优先打、不吃、可碰杠；普通胡为四组加一对，七对可开关，四张同牌可作两对。这里不判番、不做完整结算、不推断活张。与亲友开局前仍要对齐当地桌规。</p><p>牌面来自 <a href="https://github.com/FluffyStuff/riichi-mahjong-tiles" target="_blank" rel="noreferrer">FluffyStuff / riichi-mahjong-tiles ↗</a>，依据原仓库 CC0 许可证复用，使用万、条、筒与牌背。<a href="https://github.com/luxinghong/sichuan-mahjong-analyzer" target="_blank" rel="noreferrer">四川麻将分析项目 ↗</a>仅作功能研究参考，未复制其代码。胡牌与听牌逻辑在本项目独立实现。</p></section>
</template>
