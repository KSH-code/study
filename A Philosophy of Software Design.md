# Preface
- 개발 방법론, 디버깅, 디자인패턴, 알고리즘 등 다양한 소프트웨어 엔지니어링에 대한 논의는 이뤄지고 있고 모두 가치가 있지만, 소프트웨어 디자인에 대한 내용은 딱히 다뤄지지 않았다.
- 많은 사람들은 소프트웨어 디자인이 재능의 영역으로 생각한다. 하지만, 다양한 과학적인 증거로 이 능력은 노력으로 학습을 할 수 있다고 한다.
- 실제로 이 책은 draft, get feedback, rewrite의 iterative process를 통해 학습한다.

# Introduction
- 소프트웨어는 실제 세계의 한계에 영향이 거의 없기 때문에 창의적인 mind가 필요한 영역이다.
- 소프트웨어는 시간이 지남에따라 신기능이 추가되고 관리되고 이로인해 항상 복잡해진다. 따라서 해당 내용들을 감소시키는 것이 필요하다.
  - 복잡성 제거: 코드를 엣지 케이스없이 간단명료하게 만들거나, 또 다른 방법으로는 모듈화가 있다.
- 책의 목표
  1. 복잡성이 왜 중요한지 알고, 프로그램이 불필요한 복잡성을 가질 때 인식하는 방법을 안다.
  2. 복잡성을 줄이는 방법을 안다.
- *내 생각: 이 책은 소프트웨어의 성장을 효율적으로 하는 방법을 중요하게 생각하고, 이를 잘 처리하기 위한 방법을 정리했을 것으로 느껴진다.*

# The Nature of Complexity
- 복잡성: 수정하기 어렵거나 읽기 어려운 것들이다.
- 시스템의 크기에 따라 수정하기 어렵거나 읽기 어려운 것들이 있을 수 있으나, 이 책은 작은 시스템에서도 발생할 수 있는 것들에 대해 논의하고자 한다.
  - C = sum(complexity of part * fraction of time spended working on)
- 복잡성으로 인한 문제들
  - Change amplification
    - 웹 전체 페이지의 배경 색이 변경되는 것을 대응하려면 어떻게 해야할까?
    - *해법 고민해보자*
  - Cognitive load
    - 한 작업을 처리하기 위해 알아야 하는 지식은 어느정도여야 할까? 많이 알아야 한다면 어떤 문제가 생길까?
    - *해법 고민해보자*
  - Unknown unknowns
    - 특정 페이지에서만 적용되는 색깔들은 어떻게 관리해야 할까?
    - *해법 고민해보자*
- 부가적인 문서가 필요하다면 software design측면에서는 red flag이다.
  - simple하지 않고, obvious하지 않기 때문이다.
- 복잡성은 한 번의 큰 문제로 오지 않고, 조금씩 조금씩 쌓여가며 문제를 만든다. 이는 결국 거의 모든 부분을 수정해야할 만큼 문제가 된다.
- *내 생각: 기획을 명확하게 이해하고, 코드가 수정하기 어렵다면 미리 리팩토링을 해야한다. 코드가 수정하기 어렵다고 느끼는 것이 첫 번째의 시작이며 이는 더 좋은 디자인을 선택할 수 있는 기회이기도 하다.*

# Working Code Isn’t Enough
- 일반적으로 회사에서는 tactical mindset을 원하지만, 우리는 strategic mindset을 가져야한다.
- tactical programming: 최소한의 수정을 통해 기능을 빠르게 구현하는 방식을 의미한다.
- strategic programming: tactical programming과 반대로 분석, 수정을 통해서 feature구현을 하며 great design으로 가는 방식을 의미한다.
- difference both
  - Facebook(Meta) v.s. Google
  - Meta: tactical -> strategic
  - Google: strategic
  - 경쟁사가 있다면 신규기능은 tatical programming으로 빠르게 시장 검증을 하고 strategic하게 변경하는 것은 어떨까?
- 프로젝트의 기간 중 10% ~ 20%를 소프트웨어 개선작업으로 사용하자
  - 지금 당장은 불필요할 수 있지만, 점점 소프트웨어가 발전함에 따라 tactical하게만 하는 작업과는 큰 차이가 발생할 수 있다.

# Modules Should Be Deep
- 각각 모듈은 각각에 모듈에 대해서만 복잡성을 가져야만 개발하기가 편리하다. Congnitive load가 있으면 안좋기 때문이다.
- 하지만, 현실세계에서는 모듈은 함께 동작해야 하므로 불가능하다. 그래서 우리는 이 의존성을 최소화 시키는 것이 목표이다.
  - interface와 implementation을 이용한다.
  - interface: what
  - implementation: how
- interface와 implementation의 분리는 사용하는 유저들에 따라 다르게 구성해야 한다.
  - File system은 최적화가 많이 필요한 경우 어떤 방식으로 memory를 다루는지와 같은 detail한 정보를 필요로하고,
  - 일반 유저는 create, delete, info와 같은 기능만 필요하다.
- Deep v.s. Shallow
  - deep: 추상화를 잘한 것, interface의 method수가 적은 경우이다.
  - shallow: deep과는 다르게 구현을 노출하는 것이다. method수는 구현의 복잡도와 비례한다.
  - 일반적으로는 deep module이 사용자에게 알아야 하는 기능 수를 줄이기도 하고, implementation의 수정 영향을 줄일 수 있으므로 유용하다.
  - deep module의 interface를 잘 구성하는 방법은 method를 최소화해서 제작한 후 사용자가 원하는 기능의 common case를 잘 파악한 후 제공하는 것이다.
- Too many small classes: overall complexity를 증가시킨다.

# Information Hiding
- low-level에 대한 내용은 숨겨서 cognitive load를 줄이는 것이 목표이다.
  - B-tree인 경우 어떻게 정렬하는지, page size는 어떻게 관리되는지 와 같은 내용을 의미한다.
  - 단순히 private하게 정의하는 것은 information hiding이라고 볼 수 없다. 왜냐하면, public getter, setter로 접근이 가능하기 때문이다. 하지만 간접적으로 information hiding을 하는데 도움된다.
- information hiding의 반의어는 information leakage이다.
  - 한 모듈이 변경되는 것에따라 의존하는 모듈들도 변경하는 것을 의미한다.
  - 하드코딩되거나 두 모듈이 밀접하게 알아야하는 정보는 interface의 leakage보다 위험하다. obvious하지 않기 때문이다.
- 해결하기 위한 방법으로는 한 수정으로 인해 여러 수정이 발생하는 부분들을 한 곳으로 모으는 것이다.

## Temporal decompisition
- 시간에 실행되는 방식으로 나눠서 구조화하면 information leakage가 발생한다. read, modify, save와 같은 형식으로 나누게 되면 read, save에서 공통 처리하는 로직이 생기는 것을 예로 볼 수 있다.
- 따라서, 필요한 데이터 위주로 구조화하는 것이 좋다.


## Examples
- 왼손이 하는 일을 오른손이 모르게 하라..?
  - `String getParameter(String key)` instead of `Map getParameters`
- normal case를 default하게 구현하고, 특별한 다른 케이스는 default를 override해서 사용할 수 있게끔 구현하라

## Taking it too far
- 외부에서 필요로 하는 데이터까지 숨기지 말자

# General-Purpose Modules are Deeper
- 너무 일반화하면 기능을 추가하기가 어렵기도 하고, 너무 특정 기능을 위해 코드를 작성하면 반대로 리팩토링이 필요하다.
- 어떻게 해야할까?

## Make classes somewhat general-purpose
- 인터페이스는 동일하되, 내부 구현이 변경되는 것과 무관하게 작성하자
- What is the simplest interface that will cover all my current needs?
- In how many situations will this method be used?
- Is this API easy to use for my current needs?

# Different Layer, Different Abstraction
- high layers use facilities provided by lower layers.
- each layer provides a different abstraction.

## Pass-through method
- when using adjancet layers, the problem often manifest. that is pass-through methods.
- pass to another method from argument, because it has the same signature.


## When is interface duplication OK?
- duplication ok, when it is a dispatcher.
  - if it is a same functions, that is bad.

## Decorators
- need to consider improvement features rather than decrator.

## Interface versus implementation
- corner cases should be easy to implement. if no, then it is shallow.

## Pass-through variables
- pass-through variables from upper layer to lower layer is always bad. so it can be solved with context variable(maybe global)

## Conclusion
- remeber "different layer, different abstraction" rule.

# Pull Complexity Downwards
- Your time to implement is likely not important than reader's code read-time.

# Better Together Or Better Apart?
- How to compose similar pices of functionalities.

## Together
- hard to keep track?
- need to manage by additinoal components?
- if each different files have functions?
- need different interface?

## Better Off Apart
- each implementations implement different documents.
- general functionality.
- overlap conceptually.
- hard to understand without looking at the others.

## Bring together if information is shared
- decomposition of http data and parse each data.

## Bring together to eliminate duplication
- repeated snippet should be reaplcead with a method call. but, the simple code like code of 2 lines is unnecssary replcaing.

## Bring together if it will simplify the interface
- DRY

## Separate general-purpose and special-purpose code
- Special-purpose functions should be in high layer and general-purpose functions should be in lower layer.
  - so high layer uses low layer.

## Splitting and joining methods
- every method should be clean, simple and work properly.
- spliting up method only makes sence if it results in cleaner abstractions, overall.
- when spliting often exists, it should tend to grow complexity. passing state back or forth is bad also here.

# Define Errors Out Of Existence
- exception handling is one of the most worst sources of complexity.

## Why exceptions add complexity
- the exception alters uncommon flow.
- exception handling may not be work well. that cannot be detected for a long time, because exception does not occur very often.

## Too many exceptions
- developers are over-defensive style and throwing is easier than handling so interface tends to be complex as consequence made throwing.

## Define errors out of existence
- error must be thrown only when it needs.

## Mask exceptions
- mask exceptions is a technique to handle exceptions at lower-level such as drop packet in tcp.

## Exception aggregation
- similar errors are handled at a one place.

## Just crash?
- When it is not worth to handle or throw errors, just crash rather than handling.
  - e.g. OOM

## Design special cases out of existence
- generalize a sepcial case with null object.

## Taking it too far
- if it is caught outside, handling is needed.

# Design it Twice
- Whenever you design interface or architecture, think ideas and compare to others using pros and cons.
- Consuming desinging time is less than re-implemenation.

# Why Write Comments? The Four Excuses
- Comment for high-layer abstraction is helpful to understand writers' intention also decreases first-read-time.
- Four reasons to not write comment that cannot be such reasons.

## Good code is self-documenting
- the people who belives the code written well is obvious.
- but the clean methods tend to be shallow. so it needs to understand all of them.
- in order to use method, reading and understanding method implemenetaiton are not good at abstraciton.

## I don’t have time to write comments
- always writer's time is less than readers' read-time.
- how long time-consuming to write comment? does it really need long compared to implement?

## Comments get out of date and become misleading
- can be solved with code review.

## All the comments I have seen are worthless
- explained next chapter.

## Benefits of well-written comments
- The overall idea behind comments is to capture information that was in the mind of the designer but couldn’t be represented in the code
- A Document prevents problems by removing obscurity
  - Cognitive load
  - Unknown unknowns

# Comments Should Describe Things that Aren’t Obvious from the Code
- Comments should be described low-level details that cannot be understood without reading other codes.
  - e.g. `a` must be called before `b`

## Pick conventions
- Consistency
  - to write and read easily.
- Clarity
  - for help to others.
- the categories of comment.
  - Interface: overall behavior
  - Data structure member: instance variable, field data and so on.
  - Implementation comment: inside of method
  - Cross-module comment: describe cross-module
- Class variable, method both have to have comment. it is good to have comments rather than worrying about that do not have a comment.
  - I do not agree with in super clear modules. (e.g. `getMaximumNumber(array)`)
- Don’t repeat the code

## Don’t repeat the code
- Comments that describe operations itself in the same way are always bad.

## Lower-level comments add precision
- write a comment to explain it for what like

## Interface documentation
- do not need to explain implementation with specific ways.

## Implementation comments: what and why, not how
- explain for what instead of not to explain how it processes because that is explaind with code itself.

## Cross-module design decisions
- consider maintaining comment at the same place and then share its link where it needs.

## Conclusion
- comments are for reader's first time not writer. if reviewer says it is not obvious then it likely is not obvious.

# Choosing Names
- how does it name for identifier? good name reduces time.

## Example: bad names cause bugs
- an ambiguous idnetifier will cause bugs.

## Create an image
- identifier should be read and understood in isolation. which means it can draw a picture using identifier.

## Names should be precise
- `count` is not precise. `activeCount` is more precies.
- `blinkStatus` is vague. `isCursorVisible` is more informative.

## Use names consistently
- for reducing congnitive load, it is needed.

## Conclusion
- the naming is important

# Write The Comments First
- Write a comment first before write a code.

## Delayed comments are bad comments
- After write a code, writing a comment is less attractive compared to writing code.

## Write the comments firs
- writing class interface comments
- writing with signature
- writing public method structure with implementation comments
- implement
- repeat loops.

## Comments are a design tool
- comments are like an abstraction. so before implemneting, that can re-design rapidly.

## Are early comments expensive?
- calculation total fration of writing comments against writing code.

# Modifying Existing Code

## Stay strategic
- always you stay stratigic in modifying existing code. even if you have no time to refactor, you can get the time to refactor by planning to your boss.

## Maintaining comments: keep the comments near the code

## Comments belong in the code, not the commit log
- because it will be searched hard.

## Maintaining comments: avoid duplication
## Maintaining comments: check the diffs
## Higher-level comments are easier to maintain

# Consistency
- the consistency of code is important to readers. because it will easily be understood
- but if you were overzealous, it becomes too much overhead to implement or read.

# Code Should be Obvious
- it is the same as consistency to reduce readers' time-consuming.
- code must be easy to read and understand.

# Software Trends
- consider composite rather than inherit or override.
- tdd or agile can make a tactical mindset so time to refactor must exist.
- getter and setter are shallow that become complicate interface so you need to use that it must be needed.

# Designing for Performance
- optimization is sometimes not to improve but interfaces are getting worse.
- measure perforamnce both before optimization and after optimization.
