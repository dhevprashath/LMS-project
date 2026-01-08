import requests

BASE_URL = "http://127.0.0.1:8000"

def verify():
    # 1. Check User Certificates
    print("Checking user certificates...")
    try:
        res = requests.get(f"{BASE_URL}/certificates/user/2")
        if res.status_code != 200:
            with open("error_log.txt", "w") as f:
                f.write(res.text)
            print(f"Failed to fetch. Error logged to error_log.txt")
            return
        
        certs = res.json()
        print(f"Found {len(certs)} certificates.")
        
        python_cert = None
        react_cert = None
        
        for cert in certs:
            course_title = cert.get('course', {}).get('title')
            print(f"- Certificate: {cert['certificate_code']} for {course_title}")
            
            if "Python" in course_title:
                python_cert = cert
            elif "React" in course_title:
                react_cert = cert
                
        if not python_cert:
            print("ERROR: Python certificate missing.")
        if not react_cert:
            print("ERROR: ReactJS certificate missing.")
            
        if python_cert and react_cert:
            print("SUCCESS: Both certificates found.")
            
            # 2. Test Download
            print("\nTesting download for ReactJS certificate...")
            code = react_cert['certificate_code']
            dl_res = requests.get(f"{BASE_URL}/certificates/download/{code}")
            
            if dl_res.status_code == 200 and dl_res.headers['content-type'] == 'application/pdf':
                print(f"SUCCESS: Download endpoint working. PDF size: {len(dl_res.content)} bytes")
            else:
                with open("error_log.txt", "w") as f:
                    f.write(dl_res.text)
                print(f"ERROR: Download failed. Status: {dl_res.status_code}")

    except Exception as e:
        print(f"Verification failed with error: {e}")

if __name__ == "__main__":
    verify()
