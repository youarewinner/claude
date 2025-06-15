document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    const result = document.getElementById('result');
    const resultData = document.getElementById('resultData');

    const jobOtherRadio = document.getElementById('jobOther');
    const jobOtherText = document.getElementById('jobOtherText');

    if (jobOtherRadio && jobOtherText) {
        document.querySelectorAll('input[name="job"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'other') {
                    jobOtherText.style.display = 'block';
                    jobOtherText.required = true;
                } else {
                    jobOtherText.style.display = 'none';
                    jobOtherText.required = false;
                    jobOtherText.value = '';
                }
            });
        });
    }

    const noInvestCheckbox = document.getElementById('noInvest');
    if (noInvestCheckbox) {
        noInvestCheckbox.addEventListener('change', function() {
            const otherInvestments = document.querySelectorAll('input[name="investments"]:not(#noInvest)');
            if (this.checked) {
                otherInvestments.forEach(checkbox => {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                });
            } else {
                otherInvestments.forEach(checkbox => {
                    checkbox.disabled = false;
                });
            }
        });

        document.querySelectorAll('input[name="investments"]:not(#noInvest)').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    noInvestCheckbox.checked = false;
                }
            });
        });
    }

    const noAICheckbox = document.getElementById('noAI');
    if (noAICheckbox) {
        noAICheckbox.addEventListener('change', function() {
            const otherAIExperiences = document.querySelectorAll('input[name="aiExperience"]:not(#noAI)');
            if (this.checked) {
                otherAIExperiences.forEach(checkbox => {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                });
            } else {
                otherAIExperiences.forEach(checkbox => {
                    checkbox.disabled = false;
                });
            }
        });

        document.querySelectorAll('input[name="aiExperience"]:not(#noAI)').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    noAICheckbox.checked = false;
                }
            });
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const surveyData = {};
        
        for (let [key, value] of formData.entries()) {
            if (surveyData[key]) {
                if (Array.isArray(surveyData[key])) {
                    surveyData[key].push(value);
                } else {
                    surveyData[key] = [surveyData[key], value];
                }
            } else {
                surveyData[key] = value;
            }
        }

        const checkboxGroups = ['investments', 'aiExperience'];
        checkboxGroups.forEach(groupName => {
            const checkboxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
            const values = Array.from(checkboxes).map(cb => cb.value);
            if (values.length > 0) {
                surveyData[groupName] = values;
            }
        });
        
        if (validateForm(surveyData)) {
            submitToGoogleForms(surveyData);
        }
    });

    function validateForm(data) {
        const requiredFields = [
            { field: 'gender', message: '성별을 선택해주세요.' },
            { field: 'age', message: '연령대를 선택해주세요.' },
            { field: 'job', message: '직업을 선택해주세요.' },
            { field: 'income', message: '소득 구간을 선택해주세요.' },
            { field: 'experience', message: '투자 경험을 선택해주세요.' },
            { field: 'aiInterest', message: 'AI 기술 관심도를 평가해주세요.' },
            { field: 'trust1', message: '신뢰도 문항 9-1을 평가해주세요.' },
            { field: 'trust2', message: '신뢰도 문항 9-2를 평가해주세요.' },
            { field: 'trust3', message: '신뢰도 문항 9-3을 평가해주세요.' },
            { field: 'trust4', message: '신뢰도 문항 9-4를 평가해주세요.' }
        ];

        for (let item of requiredFields) {
            if (!data[item.field]) {
                alert(item.message);
                return false;
            }
        }

        if (data.job === 'other' && !data.jobOtherText) {
            alert('기타 직업을 입력해주세요.');
            return false;
        }

        if (!data.investments || data.investments.length === 0) {
            alert('투자 중인 금융상품을 선택해주세요.');
            return false;
        }

        if (!data.aiExperience || data.aiExperience.length === 0) {
            alert('AI 기술 사용 경험을 선택해주세요.');
            return false;
        }
        
        return true;
    }

    function displayResults(data) {
        const genderText = {
            'male': '남성',
            'female': '여성',
            'other': '기타'
        };
        
        const ageText = {
            '20s': '20대',
            '30s': '30대',
            '40s': '40대',
            '50s': '50대',
            '60s': '60대 이상'
        };

        const jobText = {
            'student': '학생',
            'employee': '직장인',
            'business': '자영업',
            'finance': '금융업 종사자',
            'other': data.jobOtherText || '기타'
        };

        const incomeText = {
            'under200': '200만원 미만',
            '200-400': '200-400만원',
            '400-600': '400-600만원',
            '600-800': '600-800만원',
            'over800': '800만원 이상'
        };

        const expText = {
            'none': '전혀 없음',
            'under1': '1년 미만',
            '1-3': '1-3년',
            '3-5': '3-5년',
            'over5': '5년 이상'
        };

        const investmentText = {
            'stock': '주식',
            'fund': '펀드',
            'deposit': '예·적금',
            'realestate': '부동산',
            'crypto': '암호화폐',
            'none': '투자하지 않음'
        };

        const aiExpText = {
            'chatbot': 'AI 챗봇',
            'roboAdvisor': '로보어드바이저',
            'stockApp': 'AI 주식 추천 앱',
            'bankAI': '은행 AI 상담',
            'newsAI': 'AI 뉴스 분석',
            'none': '사용한 적 없음'
        };

        const investments = Array.isArray(data.investments) ? 
            data.investments.map(inv => investmentText[inv] || inv).join(', ') :
            investmentText[data.investments] || data.investments;

        const aiExperiences = Array.isArray(data.aiExperience) ? 
            data.aiExperience.map(exp => aiExpText[exp] || exp).join(', ') :
            aiExpText[data.aiExperience] || data.aiExperience;
        
        resultData.innerHTML = `
            <h3>📊 AI 금융투자 에이전트 설문조사 결과</h3>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: #3498db; margin-bottom: 1rem;">📋 기본 정보</h4>
                <p><strong>성별:</strong> ${genderText[data.gender] || data.gender}</p>
                <p><strong>연령대:</strong> ${ageText[data.age] || data.age}</p>
                <p><strong>직업:</strong> ${jobText[data.job] || data.job}</p>
                <p><strong>월 평균 소득:</strong> ${incomeText[data.income] || data.income}</p>
                <p><strong>투자 경험:</strong> ${expText[data.experience] || data.experience}</p>
                <p><strong>투자 상품:</strong> ${investments}</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h4 style="color: #9c27b0; margin-bottom: 1rem;">🤖 AI 기술 친숙도</h4>
                <p><strong>AI 사용 경험:</strong> ${aiExperiences}</p>
                <p><strong>AI 관심도:</strong> ${data.aiInterest}/7점</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h4 style="color: #e74c3c; margin-bottom: 1rem;">📊 신뢰도 평가</h4>
                <p><strong>시장 분석 능력:</strong> ${data.trust1}/7점</p>
                <p><strong>투자 타이밍 판단:</strong> ${data.trust2}/7점</p>
                <p><strong>리스크 관리:</strong> ${data.trust3}/7점</p>
                <p><strong>안정적 수익 창출:</strong> ${data.trust4}/7점</p>
                <p><strong>평균 신뢰도:</strong> ${((parseInt(data.trust1) + parseInt(data.trust2) + parseInt(data.trust3) + parseInt(data.trust4)) / 4).toFixed(1)}/7점</p>
            </div>

            ${data.feedback ? `
            <div style="margin-bottom: 2rem;">
                <h4 style="color: #28a745; margin-bottom: 1rem;">💭 추가 의견</h4>
                <p style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #28a745;">${data.feedback}</p>
            </div>
            ` : ''}

            <div style="margin-top: 2rem; padding-top: 1rem; border-top: 2px solid #e9ecef; text-align: center;">
                <small style="color: #6c757d; font-size: 0.9rem;">
                    📅 제출 시간: ${new Date().toLocaleString('ko-KR')}
                </small>
                <br>
                <small style="color: #6c757d; font-size: 0.8rem; margin-top: 0.5rem; display: block;">
                    본 설문조사는 AI 금융투자 에이전트 연구 목적으로 실시되었습니다.
                </small>
            </div>
        `;
    }

    function submitToGoogleForms(data) {
        // 제출 버튼 비활성화 및 로딩 표시
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '제출 중...';
        submitBtn.disabled = true;

        // Google Forms URL (실제 Form ID로 교체 필요)
        const GOOGLE_FORM_URL = 'GOOGLE_FORMS_URL_HERE';
        
        // Google Forms 필드 매핑 (실제 entry ID로 교체 필요)
        const formData = new FormData();
        
        // 기본 정보
        formData.append('entry.GENDER_ENTRY_ID', data.gender);
        formData.append('entry.AGE_ENTRY_ID', data.age);
        formData.append('entry.JOB_ENTRY_ID', data.job === 'other' ? data.jobOtherText : data.job);
        formData.append('entry.INCOME_ENTRY_ID', data.income);
        formData.append('entry.EXPERIENCE_ENTRY_ID', data.experience);
        
        // 투자 상품 (복수 선택)
        if (Array.isArray(data.investments)) {
            formData.append('entry.INVESTMENTS_ENTRY_ID', data.investments.join(', '));
        } else if (data.investments) {
            formData.append('entry.INVESTMENTS_ENTRY_ID', data.investments);
        }
        
        // AI 경험 (복수 선택)
        if (Array.isArray(data.aiExperience)) {
            formData.append('entry.AI_EXPERIENCE_ENTRY_ID', data.aiExperience.join(', '));
        } else if (data.aiExperience) {
            formData.append('entry.AI_EXPERIENCE_ENTRY_ID', data.aiExperience);
        }
        
        // AI 관심도
        formData.append('entry.AI_INTEREST_ENTRY_ID', data.aiInterest);
        
        // 신뢰도 문항들
        formData.append('entry.TRUST1_ENTRY_ID', data.trust1);
        formData.append('entry.TRUST2_ENTRY_ID', data.trust2);
        formData.append('entry.TRUST3_ENTRY_ID', data.trust3);
        formData.append('entry.TRUST4_ENTRY_ID', data.trust4);
        
        // 추가 의견
        if (data.feedback) {
            formData.append('entry.FEEDBACK_ENTRY_ID', data.feedback);
        }

        // Google Forms에 제출
        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(() => {
            // 성공 처리
            displayResults(data);
            form.style.display = 'none';
            result.classList.remove('hidden');
            
            // 로컬 스토리지에도 저장
            saveToLocalStorage(data);
        })
        .catch(error => {
            console.error('Error:', error);
            // 실패 시에도 결과 표시 (no-cors 모드에서는 실제 에러를 감지하기 어려움)
            displayResults(data);
            form.style.display = 'none';
            result.classList.remove('hidden');
            
            // 로컬 스토리지에 저장
            saveToLocalStorage(data);
        })
        .finally(() => {
            // 버튼 복원
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    function saveToLocalStorage(data) {
        try {
            const surveyResults = JSON.parse(localStorage.getItem('ai-survey-results') || '[]');
            surveyResults.push({
                timestamp: new Date().toISOString(),
                data: data
            });
            localStorage.setItem('ai-survey-results', JSON.stringify(surveyResults));
            console.log('설문 결과가 로컬 스토리지에 저장되었습니다.');
        } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
        }
    }

    // 관리자용: 로컬 스토리지 결과 확인 함수
    window.getSurveyResults = function() {
        const results = JSON.parse(localStorage.getItem('ai-survey-results') || '[]');
        console.log('저장된 설문 결과:', results);
        return results;
    };

    // 관리자용: CSV 다운로드 함수
    window.downloadSurveyResults = function() {
        const results = JSON.parse(localStorage.getItem('ai-survey-results') || '[]');
        if (results.length === 0) {
            alert('저장된 설문 결과가 없습니다.');
            return;
        }

        const csvContent = convertToCSV(results);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `ai-survey-results-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    function convertToCSV(results) {
        if (results.length === 0) return '';

        const headers = [
            '제출시간', '성별', '연령대', '직업', '소득', '투자경험', 
            '투자상품', 'AI사용경험', 'AI관심도', 
            '신뢰도1', '신뢰도2', '신뢰도3', '신뢰도4', '평균신뢰도', '추가의견'
        ];

        const csvRows = [headers.join(',')];

        results.forEach(result => {
            const data = result.data;
            const investments = Array.isArray(data.investments) ? data.investments.join(';') : data.investments || '';
            const aiExperience = Array.isArray(data.aiExperience) ? data.aiExperience.join(';') : data.aiExperience || '';
            const avgTrust = ((parseInt(data.trust1) + parseInt(data.trust2) + parseInt(data.trust3) + parseInt(data.trust4)) / 4).toFixed(1);
            
            const row = [
                result.timestamp,
                data.gender || '',
                data.age || '',
                data.job === 'other' ? data.jobOtherText || '기타' : data.job || '',
                data.income || '',
                data.experience || '',
                `"${investments}"`,
                `"${aiExperience}"`,
                data.aiInterest || '',
                data.trust1 || '',
                data.trust2 || '',
                data.trust3 || '',
                data.trust4 || '',
                avgTrust,
                `"${(data.feedback || '').replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }
});