# Base UI를 headless primitive 표준으로 사용

접근성, 포커스 관리, 키보드 동작, portal positioning이 포함된 UI primitive는 직접 구현하지 않고 Base UI를 우선 사용한다. 단순 컴포넌트라도 Base UI에 해당 primitive가 있으면 Base UI를 기본 선택지로 두며, Tailwind CSS는 시각 스타일을 입히는 레이어로 유지한다.
