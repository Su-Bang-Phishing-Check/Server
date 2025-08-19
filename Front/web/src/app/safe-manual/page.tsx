'use client';
import { HiExternalLink, HiCheckCircle } from 'react-icons/hi';
import Link from 'next/link';

interface LinkType {
  href: string;
  label: string;
}
const ManualPage = () => {
  const LinkExternal = ({ href, label }: LinkType) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-blue-600 hover:underline mt-1"
    >
      {label}
      <HiExternalLink className="ml-1" />
    </a>
  );

  const LinkInternal = ({ href, label }: LinkType) => (
    <Link href={href}>
      <span className="inline-flex items-center text-blue-600 hover:underline mt-1">
        {label}
        <HiExternalLink className="ml-1" />
      </span>
    </Link>
  );
  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-[900px] flex flex-col gap-y-4 py-2 mb-6">
        <h1 className="text-2xl font-bold text-left text-[#3177FF]">
          보이스피싱 피해 대처방법
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          보이스피싱 전화 또는 문자를 받은 경우,{' '}
          <br className="md: hidden" />
          사기범에게 이체·송금, 개인정보를 제공한 경우
          <br />
          또는 악성앱이 설치되어 정보유출이 우려되는 경우 다음과 같이
          대응해야 합니다.
        </p>
      </div>
      <section className="bg-gray-200 p-2 md:p-6 rounded-2xl mt-6">
        <div className="text-base md:text-[1.125rem] font-bold p-2 mb-2">
          <h1 className="pl-8 -indent-5">
            1. 입금 금융회사 또는 송금 금융회사 콜센터에{' '}
            <span className="text-red-600">즉시</span> 전화하여
            <span className="text-red-600"> 피해신고</span> 및
            <span className="text-red-600"> 계좌지급정지 신청</span>
          </h1>
          <p className="text-[0.875rem] md:text-base pl-8">
            <LinkInternal
              label="(금융회사 전화번호 모음)"
              href="/contact-book"
            />
          </p>
        </div>
        <div className="text-base md:text-[1.125rem] font-bold p-2 mb-2">
          <h1 className="pl-8 -indent-5">
            2. 신분증, 계좌정보, 카드정보 등{' '}
            <span className="text-red-600">개인정보가 유출</span>
            되거나 유출 의심이 되는 경우,
            <br />
            수상한 <span className="text-red-600">URL접속</span>으로
            악성앱 설치가 의심되는 경우
          </h1>
        </div>
        <p
          className="inline-flex items-center bg-[#001C52] rounded-3xl 
          text-white text-[0.875rem] md:text-base font-medium gap-2 py-2 pl-4 pr-8 ml-4"
        >
          <span>
            <HiCheckCircle />
          </span>
          정보 유출된 휴대전화나 PC가 아닌 다른 휴대전화나 PC 사용
          권장
        </p>
        <div className="text-[0.875rem] md:text-base p-2 m-4">
          <ul>
            <li className="mb-4">
              <h1 className="font-bold">
                1) 개인정보 노출 사실 등록
              </h1>
              <div>
                금감원 개인정보 노출자 사고예방 시스템
                <LinkExternal
                  label="(pd.fss.or.kr)"
                  href="pd.fss.or.kr"
                />
                접속
                <br />→ 유의사항 확인 후 동의 체크{' '}
                <br className="md:hidden" />
                → 등록 및 해제 신청
                <br />→ 휴대폰 본인 인증 후 개인정보 노출자 등록
                <p
                  className="inline-flex items-center bg-[#001C52] rounded-3xl 
                  text-white text-[0.875rem] md:text-base font-medium gap-2 py-2 pl-4 pr-8 my-2"
                >
                  <span>
                    <HiCheckCircle />
                  </span>
                  개인정보 노출사실을 등록하면 신규계좌 개설, 신용카드
                  발급 등 제한
                </p>
              </div>
            </li>
            <li className="mb-4">
              <h1 className="font-bold">
                2) 본인계좌 지급정지(일괄 및 부분) 신청
              </h1>
              <div>
                금융결제원 계좌정보통합관리서비스
                <LinkExternal
                  label="(www.payinfo.or.kr)"
                  href="www.payinfo.or.kr"
                />
                접속
                <br />→ 본인계좌 일괄 지급정지{' '}
                <br className="md:hidden" />
                → 공동/금융인증서 및 휴대전화 인증
                <br />→ 계좌 조회 → 지급정지 신청
                <br />- 금융회사 영업점을 방문하거나{' '}
                <span className="text-red-600 font-bold">
                  콜센터(전화)
                </span>
                를 통해서도 지급정지 신청 가능 본인 계좌
              </div>
            </li>
            <li className="mb-4">
              <h1 className="font-bold">
                3) 휴대폰 개통 및 명의도용 여부 확인
              </h1>
              <div>
                한국정보통신진흥협회 명의도용방지 서비스
                <LinkExternal
                  label="(www.msafer.or.kr)"
                  href="www.msafer.or.kr"
                />
                접속
                <br />→ 공동/금융인증서 로그인{' '}
                <br className="md:hidden" />
                → 가입사실현황조회, 가입제한 서비스
                <br />- 본인 명의 휴대전화 개통 현황 확인 및 신규 개설
                차단
                <br />- 명의도용 휴대전화가 개통된 경우, 해당 통신사
                등에{' '}
                <span className="text-red-600 font-bold">
                  회선 해지 신청 및 명의도용 신고
                </span>
              </div>
            </li>
            <li className="mb-4">
              <h1 className="font-bold">4) 신분증 분실신고</h1>
              <div>
                - 주민등록증은 정부24
                <LinkExternal
                  label="(https://www.gov.kr)"
                  href="https://www.gov.kr"
                />{' '}
                분실신고 또는 주민센터를 통해 분실신고/재발급
                <br />
                - 운전면허증은 도로교통공단 안전운전 통합민원
                <LinkExternal
                  label="(https://www.safedriving.or.kr)"
                  href="https://www.safedriving.or.kr"
                />{' '}
                사이트에서 재발급 진행
                <br />- 외국인등록증은 가까운 경찰서에서 분실신고,
                해당지역 출입국사무소에서 재발급
              </div>
            </li>
            <li className="mb-4">
              <h1 className="font-bold">5) 휴대폰 초기화</h1>
              <div>
                - 악성앱 삭제 및 휴대전화 초기화{' '}
                <span className="text-red-600 font-bold">
                  (초기화 전까지 휴대전화 전원을 끄거나 비행기모드
                  권장)
                </span>
                <br />- 휴대전화 제조사 서비스센터를 통해 악성코드
                감염 여부 확인 및 상담
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ManualPage;
