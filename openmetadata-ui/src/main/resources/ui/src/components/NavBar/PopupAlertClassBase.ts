/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { ComponentType } from 'react';

interface AlertCard {
  key: string;
  component: ComponentType;
}

class PopupAlertsCardsClassBase {
  // 내부망 배포: "새 버전 출시" 안내(원격 릴리스 정보 링크)와 "Star us on GitHub" 카드(실제로
  // api.github.com에 네트워크 요청을 보냄, 폐쇄망에서 실패/지연 유발)를 둘 다 비활성화.
  public alertsCards(): AlertCard[] {
    return [];
  }
}

const popupAlertsCardsClassBase = new PopupAlertsCardsClassBase();

export default popupAlertsCardsClassBase;
export { PopupAlertsCardsClassBase };
